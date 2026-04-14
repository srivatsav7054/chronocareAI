"""
ChronoCare AI - Medical AI Service
FastAPI server for medical report analysis using BioLinkBERT + BioMistral (Local Ollama)
Fully Local - No External APIs
"""

import logging
from typing import Dict, Any, List
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import json

from medical_ai import classify_department, classify_risk, analyze_with_biomistral

# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ============================================================================
# PYDANTIC DATA MODELS
# ============================================================================

class MedicalReportRequest(BaseModel):
    """Request model for medical report analysis"""
    report_text: str = Field(
        ...,
        min_length=10,
        max_length=50000,
        description="Medical report text to analyze (10-50000 characters)"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "report_text": "Patient presents with acute chest pain (8/10) and shortness of breath for 2 hours. "
                               "BP: 150/90, HR: 112, RR: 24, O2 sat: 94%. History of hypertension and smoking."
            }
        }


class MedicalAnalysisResponse(BaseModel):
    """Response model for medical analysis"""
    diagnosis: str = Field(description="Primary suspected diagnosis")
    severity: str = Field(description="Severity: Critical/Severe/Moderate/Mild")
    urgency: str = Field(description="Urgency: Immediate/Urgent/Soon/Routine")
    department: str = Field(description="Recommended medical department")
    red_flags: List[str] = Field(description="List of concerning findings")
    recommendations: str = Field(description="Recommended medical actions")
    reasoning: str = Field(description="Detailed clinical reasoning")
    
    class Config:
        json_schema_extra = {
            "example": {
                "diagnosis": "Acute Coronary Syndrome",
                "severity": "Critical",
                "urgency": "Immediate",
                "department": "Cardiology",
                "red_flags": ["Substernal chest pain", "Dyspnea", "Elevated troponin", "ST elevation"],
                "recommendations": "Immediate ECG, troponin markers, cardiology consultation, possible angiography",
                "reasoning": "Clinical presentation is highly concerning for acute coronary syndrome given..."
            }
        }


class HealthCheckResponse(BaseModel):
    """Response model for health check"""
    status: str = Field(description="Service status")
    message: str = Field(description="Status message")


class ErrorResponse(BaseModel):
    """Error response model"""
    error: str = Field(description="Error type")
    detail: str = Field(description="Error detail")


# ============================================================================
# LIFECYCLE MANAGEMENT
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage app startup and shutdown"""
    logger.info("🚀 ChronoCare AI Medical Service Starting...")
    logger.info("✓ BioLinkBERT model loaded")
    logger.info("✓ BioMistral + Ollama configured (Local)")
    logger.info("✓ No external APIs required")
    logger.info("✓ All systems operational")
    yield
    logger.info("🛑 ChronoCare AI Medical Service Shutting Down...")


# ============================================================================
# FASTAPI APPLICATION
# ============================================================================

app = FastAPI(
    title="ChronoCare AI Medical Analysis Service",
    description="Advanced medical report analysis using BioLinkBERT embeddings and BioMistral (Local Ollama)",
    version="2.0.0",
    lifespan=lifespan
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# HEALTH CHECK ENDPOINTS
# ============================================================================

@app.get("/", response_model=HealthCheckResponse)
async def root() -> Dict[str, str]:
    """
    Root endpoint - Basic health check
    
    Returns:
        Health status and message
    """
    return {
        "status": "alive",
        "message": "ChronoCare AI Medical Service Running"
    }


@app.get("/health", response_model=HealthCheckResponse)
async def health_check() -> Dict[str, str]:
    """
    Health check endpoint
    
    Returns:
        Health status and operational message
    """
    return {
        "status": "healthy",
        "message": "All systems operational - Ready to analyze medical reports"
    }


# ============================================================================
# MAIN ANALYSIS ENDPOINT
# ============================================================================

@app.post("/analyze", response_model=MedicalAnalysisResponse)
async def analyze_medical_report(request: MedicalReportRequest) -> Dict[str, Any]:
    """
    Analyze medical report using BioLinkBERT + BioMistral pipeline.
    
    Pipeline:
    1. Classify medical department using embeddings
    2. Classify risk level based on keywords
    3. Call BioMistral (Local) for structured medical reasoning
    4. Return comprehensive analysis
    
    Args:
        request: MedicalReportRequest with report_text
        
    Returns:
        MedicalAnalysisResponse with complete medical analysis
        
    Raises:
        HTTPException: If analysis fails
    """
    try:
        report_text = request.report_text.strip()
        
        if len(report_text) < 10:
            logger.warning("Report text too short")
            raise HTTPException(
                status_code=422,
                detail="Report text must be at least 10 characters"
            )
        
        logger.info(f"📋 Received medical report ({len(report_text)} chars)")
        
        # ===== STEP 1: CLASSIFY DEPARTMENT =====
        logger.info("Step 1/3: Classifying medical department...")
        try:
            department = classify_department(report_text)
            logger.info(f"✓ Department: {department}")
        except Exception as e:
            logger.error(f"Error classifying department: {e}")
            department = "General Medicine"
        
        # ===== STEP 2: CLASSIFY RISK =====
        logger.info("Step 2/3: Classifying risk level...")
        try:
            risk_level = classify_risk(report_text)
            logger.info(f"✓ Risk Level: {risk_level}")
        except Exception as e:
            logger.error(f"Error classifying risk: {e}")
            risk_level = "Medium"
        
        # ===== STEP 3: CALL BIOMISTRAL (LOCAL) FOR MEDICAL REASONING =====
        logger.info("Step 3/3: Calling BioMistral (Local Ollama) for medical reasoning...")
        try:
            analysis = analyze_with_biomistral(
                report=report_text,
                department=department,
                risk=risk_level
            )
        except Exception as e:
            logger.error(f"Error calling BioMistral: {e}")
            raise HTTPException(
                status_code=503,
                detail=f"Medical analysis service unavailable: {str(e)}"
            )
        
        # ===== VALIDATE RESPONSE =====
        required_fields = [
            "diagnosis", "severity", "urgency", "department",
            "red_flags", "recommendations", "reasoning"
        ]
        
        missing_fields = [f for f in required_fields if f not in analysis]
        if missing_fields:
            logger.error(f"Missing fields in analysis: {missing_fields}")
            raise HTTPException(
                status_code=502,
                detail=f"Analysis response missing required fields: {missing_fields}"
            )
        
        # ===== VALIDATE RED FLAGS IS A LIST =====
        if not isinstance(analysis.get("red_flags"), list):
            analysis["red_flags"] = [str(analysis.get("red_flags", "No red flags identified"))]
        
        logger.info(f"✅ Analysis complete: {analysis['diagnosis']}")
        logger.info(f"   Severity: {analysis['severity']}")
        logger.info(f"   Urgency: {analysis['urgency']}")
        logger.info(f"   Department: {analysis['department']}")
        
        return analysis
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error: {e}")
        raise HTTPException(
            status_code=502,
            detail="Failed to parse analysis response"
        )
    except Exception as e:
        logger.error(f"Unexpected error during analysis: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Medical analysis failed: {str(e)}"
        )


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    """Handle validation errors"""
    logger.error(f"Validation error: {exc}")
    return {
        "error": "Validation Error",
        "detail": str(exc)
    }


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return {
        "error": "Internal Server Error",
        "detail": "An unexpected error occurred"
    }


# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    logger.info("=" * 70)
    logger.info("CHRONOCARE AI - MEDICAL ANALYSIS SERVICE")
    logger.info("=" * 70)
    logger.info("Starting FastAPI server on http://0.0.0.0:8000")
    logger.info("API Documentation: http://localhost:8000/docs")
    logger.info("Alternative docs: http://localhost:8000/redoc")
    logger.info("=" * 70)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )