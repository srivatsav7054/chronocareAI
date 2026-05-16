"""
ChronoCare AI - Medical AI Engine
BioLinkBERT + BioMistral (Local Ollama)
FULLY LOCAL VERSION - NO EXTERNAL APIS
"""

import os
import json
import logging
from typing import Dict, Any, List

import torch
import torch.nn.functional as F

from transformers import AutoTokenizer, AutoModel

import ollama

from dotenv import load_dotenv


# ============================================================
# LOGGING
# ============================================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()

logger.info("✓ Environment loaded")

logger.info("✓ Gemini client initialized")


# ============================================================
# LOAD BIOLINKBERT MODEL
# ============================================================

MODEL_NAME = "michiyasunaga/BioLinkBERT-base"

logger.info("Loading BioLinkBERT...")

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME)

model.eval()

logger.info("✓ BioLinkBERT loaded successfully")


# ============================================================
# MEDICAL DEPARTMENTS
# ============================================================

DEPARTMENTS = [

    "Cardiology",
    "Neurology",
    "Dermatology",
    "Orthopedics",
    "Emergency Medicine",
    "Pulmonology",
    "Infectious Disease",
    "Gastroenterology",
    "Endocrinology",
    "General Medicine"

]


# ============================================================
# EMBEDDING GENERATION
# ============================================================

def get_embeddings(text: str) -> List[float]:

    if not text:
        return [0.0] * 768

    inputs = tokenizer(

        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512

    )

    with torch.no_grad():

        outputs = model(**inputs)

    cls_embedding = outputs.last_hidden_state[:, 0, :]

    return cls_embedding[0].cpu().tolist()


# ============================================================
# DEPARTMENT CLASSIFICATION
# ============================================================

def classify_department(report_text: str) -> str:

    try:

        report_embedding = torch.tensor([get_embeddings(report_text)])

        best_score = -1
        best_department = "General Medicine"

        for dept in DEPARTMENTS:

            dept_embedding = torch.tensor([get_embeddings(dept)])

            similarity = F.cosine_similarity(

                report_embedding,
                dept_embedding

            ).item()

            if similarity > best_score:

                best_score = similarity
                best_department = dept

        logger.info(f"Department classified: {best_department}")

        return best_department

    except Exception as e:

        logger.error(e)

        return "General Medicine"


# ============================================================
# RISK CLASSIFICATION
# ============================================================

def classify_risk(report_text: str) -> str:

    text = report_text.lower()

    HIGH = [

        "heart attack",
        "stroke",
        "unconscious",
        "severe chest pain",
        "cardiac arrest",
        "respiratory failure"

    ]

    MEDIUM = [

        "fever",
        "infection",
        "pain",
        "vomiting",
        "weakness"

    ]

    if any(x in text for x in HIGH):
        return "High"

    if any(x in text for x in MEDIUM):
        return "Medium"

    return "Low"


# ============================================================
# GEMINI MEDICAL ANALYSIS
# ============================================================

# ============================================================
# BIOMISTRAL MEDICAL ANALYSIS (LOCAL OLLAMA)
# ============================================================

def analyze_with_biomistral(
    report: str,
    department: str,
    risk: str
) -> Dict[str, Any]:
    """
    Analyze medical report using BioMistral running locally via Ollama.
    
    Args:
        report: Medical report text
        department: Classified medical department
        risk: Risk level (High/Medium/Low)
        
    Returns:
        Dictionary with structured medical analysis
    """

    try:
        logger.info("🔄 Calling BioMistral (Local Ollama)...")

        prompt = f"""You are a professional clinical AI assistant specializing in medical analysis.

PATIENT REPORT:
{report}

CONTEXT:
- Department: {department}
- Risk Level: {risk}

Analyze this medical report and return ONLY a valid JSON object (no markdown, no extra text):

{{
"diagnosis": "Clear primary diagnosis based on symptoms",
"severity": "Critical/Severe/Moderate/Mild",
"urgency": "Immediate/Urgent/Soon/Routine",
"department": "{department}",
"red_flags": ["symptom1", "symptom2", "concern3"],
"recommendations": "Specific clinical recommendations and next steps",
"reasoning": "Brief explanation of clinical reasoning"
}}

Return ONLY the JSON object, nothing else."""

        # Call BioMistral via Ollama
        response = ollama.chat(
            model="mistral",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional clinical AI assistant. Provide accurate medical analysis in strict JSON format only. No markdown, no extra text."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            stream=False
        )

        # Extract text from response
        text = response["message"]["content"].strip()

        logger.info("📝 BioMistral response received")

        # Remove markdown code blocks if present
        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()

        # Parse JSON
        result = json.loads(text)

        # Validate required fields
        required_fields = [
            "diagnosis", "severity", "urgency", "department",
            "red_flags", "recommendations", "reasoning"
        ]

        missing_fields = [f for f in required_fields if f not in result]
        if missing_fields:
            logger.warning(f"⚠️ Missing fields: {missing_fields}, filling with defaults")
            for field in missing_fields:
                if field == "red_flags":
                    result[field] = []
                else:
                    result[field] = "Not specified"

        # Ensure red_flags is a list
        if not isinstance(result.get("red_flags"), list):
            result["red_flags"] = [str(result.get("red_flags", ""))]

        logger.info("✅ BioMistral analysis completed successfully")
        return result

    except json.JSONDecodeError as e:
        logger.error(f"❌ JSON parsing error: {e}")
        logger.error(f"   Raw response: {text[:200]}")
        
        return {
            "diagnosis": "Analysis completed but format parsing failed",
            "severity": "Unknown",
            "urgency": "Review Required",
            "department": department,
            "red_flags": ["Unable to parse structured response"],
            "recommendations": "Manual clinician review recommended",
            "reasoning": f"System generated response but JSON parsing failed: {str(e)}"
        }

    except Exception as e:
        logger.error(f"❌ BioMistral Error: {type(e).__name__}: {e}")
        
        # Check if Ollama is running
        if "refused" in str(e).lower() or "connection" in str(e).lower():
            logger.error("❌ Cannot connect to Ollama. Is it running? Run: ollama serve")
        
        return {
            "diagnosis": "Local analysis service unavailable",
            "severity": "Unknown",
            "urgency": "Retry Required",
            "department": department,
            "red_flags": [],
            "recommendations": "Ensure Ollama is running and BioMistral model is loaded",
            "reasoning": f"Error: {str(e)}. Start Ollama with: ollama serve"
        }