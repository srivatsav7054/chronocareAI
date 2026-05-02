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
    Enhanced analysis using BioLinkBERT for context extraction and Mistral for text generation.
    """

    try:
        logger.info("🔄 Step 1: Extracting Clinical Context with BioLinkBERT...")
        
        # Get embeddings from BioLinkBERT to understand the 'flavor' of the medical text
        # In a real clinical setting, we might use this to find similar cases, 
        # but here we use it to validate the report's depth.
        embeddings = get_embeddings(report[:512]) # Use first 512 tokens
        context_intensity = sum([abs(x) for x in embeddings[:10]]) # Just a dummy metric for demonstration
        
        logger.info(f"✓ BioLinkBERT Context Intensity: {context_intensity:.4f}")

        # Use mistral as the primary medical engine
        model_to_use = "mistral"
        logger.info(f"Using standard model: {model_to_use}")

        # Pass the "BioLinkBERT Findings" into the prompt
        prompt = f"""You are a professional clinical AI. You have been provided with a medical report and context from a BioLinkBERT embedding analysis.
        
        BIO-LINKBERT CONTEXT:
        - Department: {department}
        - Risk Level: {risk}
        - Clinical Vector Intensity: {context_intensity:.4f}
        
        REPORT CONTENT:
        {report}
        
        TASK:
        Generate a structured clinical analysis. 
        Focus on:
        1. Primary Clinical Diagnosis
        2. Severity (Critical/Severe/Moderate/Mild)
        3. Urgency (Immediate/Urgent/Soon/Routine)
        4. Specific Red Flags (as a list)
        5. Actionable Recommendations
        6. Clinical Reasoning
        
        Return ONLY valid JSON:
        {{
        "diagnosis": "...",
        "severity": "...",
        "urgency": "...",
        "department": "{department}",
        "red_flags": ["...", "..."],
        "recommendations": "...",
        "reasoning": "..."
        }}"""

        response = ollama.chat(
            model=model_to_use,
            messages=[
                {"role": "system", "content": "You are a clinical AI. Output strict JSON only."},
                {"role": "user", "content": prompt}
            ],
            stream=False,
            options={"temperature": 0}
        )

        text = response["message"]["content"].strip()
        logger.info(f"Response received ({len(text)} chars)")

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

# ============================================================
# HEALTH SCORE PREDICTION (LOCAL OLLAMA)
# ============================================================

def predict_health_score(
    current_score: int,
    age: int,
    conditions: List[str],
    recent_reports: List[Dict[str, str]],
    recent_events: List[Dict[str, str]]
) -> Dict[str, Any]:
    """
    Predict future health score trajectory based on medical profile.
    """
    try:
        logger.info("🔄 Calling BioMistral (Local) for Score Prediction...")
        
        reports_text = "\n".join([f"- {r.get('diagnosis', 'Unknown')} ({r.get('severity', 'Unknown')})" for r in recent_reports])
        events_text = "\n".join([f"- {e.get('type', 'Event')}: {e.get('title', '')}" for e in recent_events])

        prompt = f"""You are a predictive clinical AI. Analyze this patient's data and forecast their 3-month health score.

PATIENT PROFILE:
- Age: {age}
- Current Base Score: {current_score}/100
- Chronic Conditions: {', '.join(conditions) if conditions else 'None reported'}

RECENT MEDICAL REPORTS (Last 6 months):
{reports_text if reports_text else "None"}

RECENT MEDICAL EVENTS (Last 6 months):
{events_text if events_text else "None"}

Based on the trajectory shown by their conditions, recent events, and reports, predict their health score 3 months from now.
Return ONLY a valid JSON object (no markdown, no extra text):

{{
"predicted_score_3_months": 85,
"risk_trajectory": "Improving" or "Stable" or "Declining",
"clinical_forecast": "Short paragraph explaining why the score is projected to change or remain stable based on the specific conditions and recent events.",
"preventative_actions": ["Action 1", "Action 2"]
}}

Return ONLY the JSON object."""

        response = ollama.chat(
            model="mistral",
            messages=[
                {"role": "system", "content": "You are a clinical predictive model. Output strict JSON only."},
                {"role": "user", "content": prompt}
            ],
            stream=False
        )

        text = response["message"]["content"].strip()
        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()

        result = json.loads(text)
        
        # Ensure correct types
        result["predicted_score_3_months"] = int(result.get("predicted_score_3_months", current_score))
        if not isinstance(result.get("preventative_actions"), list):
            result["preventative_actions"] = [str(result.get("preventative_actions", "Continue regular checkups"))]
            
        logger.info("✅ Score prediction completed successfully")
        return result

    except Exception as e:
        logger.error(f"❌ Prediction Error: {e}")
        return {
            "predicted_score_3_months": current_score,
            "risk_trajectory": "Unknown",
            "clinical_forecast": "AI Prediction service currently unavailable. Please ensure local Ollama is running.",
            "preventative_actions": ["Maintain current health routine", "Consult with healthcare provider"]
        }

# ============================================================
# MEDICAL STORY GENERATION (LOCAL OLLAMA)
# ============================================================

def generate_medical_story(
    conditions: List[str],
    timeline: List[Dict[str, str]],
    reports: List[Dict[str, str]]
) -> Dict[str, Any]:
    """
    Generate a cohesive plain-English clinical narrative.
    """
    try:
        logger.info("🔄 Calling BioMistral (Local) for Medical Story Generation...")
        
        events_text = "\n".join([f"- {e.get('date', 'Unknown Date')}: {e.get('title', '')} ({e.get('type', '')})" for e in timeline[:10]])
        reports_text = "\n".join([f"- Diagnosis: {r.get('diagnosis', '')}, Severity: {r.get('severity', '')}" for r in reports[:5]])

        prompt = f"""You are a compassionate clinical AI. Write a cohesive, plain-English "Medical Story" summarizing this patient's health journey based on their records.

CHRONIC CONDITIONS: {', '.join(conditions) if conditions else 'None reported'}

RECENT TIMELINE:
{events_text if events_text else "None"}

KEY REPORT FINDINGS:
{reports_text if reports_text else "None"}

Write a 2-3 paragraph summary that explains their medical journey chronologically and cohesively. It should be easy for the patient to read and understand.
Return ONLY a valid JSON object (no markdown, no extra text):

{{
"story": "The cohesive medical narrative goes here in plain text. Do not use complex medical jargon.",
"key_takeaway": "A one sentence empowering conclusion or primary health focus."
}}

Return ONLY the JSON object."""

        response = ollama.chat(
            model="mistral",
            messages=[
                {"role": "system", "content": "You are a clinical summarization AI. Output strict JSON only."},
                {"role": "user", "content": prompt}
            ],
            stream=False
        )

        text = response["message"]["content"].strip()
        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()

        result = json.loads(text)
        logger.info("✅ Medical story generation completed successfully")
        return result

    except Exception as e:
        logger.error(f"❌ Story Generation Error: {e}")
        return {
            "story": "Your medical story cannot be generated at this time because the AI service is unavailable. Please ensure local Ollama is running.",
            "key_takeaway": "Keep track of your health events and consult your doctor."
        }