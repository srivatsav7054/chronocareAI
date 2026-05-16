# 🚀 ChronoCare AI - Updated Setup Guide

## ✅ What Has Been Updated

Your medical AI service has been completely updated with:

✅ **Proper .env Integration**
- Loads API key from `.env` file using `python-dotenv`
- Secure environment variable management
- No hardcoded API keys

✅ **Complete BioLinkBERT Integration**
- Uses `AutoTokenizer` and `AutoModel` from transformers
- Generates medical embeddings (768 dimensions)
- CLS token embedding extraction
- Department classification via cosine similarity

✅ **Full Gemini API Integration**
- Configured with `genai.configure(api_key=GEMINI_API_KEY)`
- Medical reasoning prompt engineering
- Structured JSON response handling
- Comprehensive error handling

✅ **Production-Ready FastAPI**
- `/analyze` endpoint with 3-step pipeline
- Step 1: Classify department
- Step 2: Classify risk level
- Step 3: Call Gemini API for reasoning
- Proper validation and error responses

---

## 📋 Quick Start (Windows - 5 Minutes)

### Step 1: Update Your .env File

Open `.env` in the ai-service directory and replace:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

With your actual API key from https://ai.google.dev/:
```
GEMINI_API_KEY=sk-YOUR_ACTUAL_KEY_HERE
```

### Step 2: Install Dependencies

```powershell
cd chronocare-ai\ai-service

# Create virtual environment (if not already done)
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Upgrade pip
python -m pip install --upgrade pip

# Install all requirements
pip install -r requirements.txt
```

**Key packages being installed:**
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `transformers` - BioLinkBERT model framework
- `torch` - PyTorch for embeddings
- `google-generativeai` - Gemini API
- `python-dotenv` - Environment variable loading

### Step 3: Run the Service

```powershell
# Make sure you're in the ai-service directory
cd chronocare-ai\ai-service

# Make sure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Start the service
python main.py
```

**Expected Output:**
```
======================================================================
CHRONOCARE AI - MEDICAL ANALYSIS SERVICE
======================================================================
Starting FastAPI server on http://0.0.0.0:8000
API Documentation: http://localhost:8000/docs
Alternative docs: http://localhost:8000/redoc
======================================================================
INFO:     Started server process [1234]
INFO:     Waiting for application startup.
✓ BioLinkBERT model loaded
✓ Gemini API configured
✓ All systems operational
INFO:     Application startup complete
```

### Step 4: Test It

Open a **new PowerShell window** (keep the service running):

```powershell
# Test with Python
python -c "
import requests
import json

response = requests.post('http://localhost:8000/analyze',
  json={'report_text': 'Patient with acute chest pain, shortness of breath, elevated BP 150/90, HR 112'})

print(json.dumps(response.json(), indent=2))
"
```

Or visit **http://localhost:8000/docs** in your browser!

---

## 📊 Complete Pipeline Explanation

### What Happens When You Call /analyze:

```
1. USER SENDS REQUEST
   POST /analyze
   {
     "report_text": "Patient presents with chest pain..."
   }
   
2. STEP 1: CLASSIFY DEPARTMENT
   - Get embeddings for report using BioLinkBERT
   - Compare with embeddings for 10 medical departments
   - Select best match (Cardiology, Neurology, etc.)
   
3. STEP 2: CLASSIFY RISK
   - Scan report for HIGH_RISK_KEYWORDS (heart attack, stroke, etc.)
   - If found → Risk = "High"
   - Else scan for MEDIUM_RISK_KEYWORDS (fever, infection, etc.)
   - If found → Risk = "Medium"
   - Else → Risk = "Low"
   
4. STEP 3: CALL GEMINI API
   - Send report + department + risk to Gemini
   - Gemini performs medical reasoning
   - Returns structured analysis:
     * Diagnosis  * Severity
     * Urgency
     * Red flags
     * Recommendations
     * Detailed reasoning
   
5. VALIDATE RESPONSE
   - Ensure all required fields present
   - Ensure red_flags is a list
   - Log results
   
6. RETURN RESPONSE
   {
     "diagnosis": "Acute Coronary Syndrome",
     "severity": "Critical",
     "urgency": "Immediate",
     "department": "Cardiology",
     "red_flags": ["Chest pain", "Dyspnea", "Elevated HR"],
     "recommendations": "Immediate cardiac evaluation...",
     "reasoning": "Clinical presentation suggests..."
   }
```

---

## 🔐 Security Implementation

### .env File Management

✅ **Created:**
- `.env` - Your actual environment file (loaded by app)
- `.env.example` - Template for reference

✅ **Protection:**
- `.env` is in `.gitignore` - Won't be committed to git
- No API key appears in code
- Only loaded at startup via `load_dotenv()`

### How It Works:

```python
# In medical_ai.py:
from dotenv import load_dotenv

load_dotenv()  # Loads .env file
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # Get from environment

# Configure Gemini with environment variable
genai.configure(api_key=GEMINI_API_KEY)
```

---

## 📁 Updated Files Structure

```
ai-service/
├── main.py                 # FastAPI server (UPDATED)
├── medical_ai.py           # Medical AI engine (UPDATED)
├── requirements.txt        # All dependencies
├── .env                    # Your API key (NEW - DO NOT COMMIT)
├── .env.example            # Template reference (UPDATED)
├── .gitignore              # Protects .env (EXISTING)
├── test_api.py             # Test suite
└── venv/                   # Virtual environment
```

---

## 🧪 Testing the Updated Code

### Test 1: Health Check
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "All systems operational - Ready to analyze medical reports"
}
```

### Test 2: Interactive API Docs
Visit: **http://localhost:8000/docs**
- Find `/analyze` endpoint
- Click "Try it out"
- Enter sample medical text
- Click "Execute"

### Test 3: Full Test Suite
```bash
python test_api.py
```

This runs 3 real medical case studies.

### Test 4: Direct Python

```python
import requests

# Cardiac case
report = """
Patient: 58-year-old male
Chief Complaint: Acute chest pain
HPI: Sudden onset substernal chest pain radiating to left arm.
Associated with dyspnea and diaphoresis for 2 hours.
Vital Signs: BP 165/95, HR 112, RR 24, O2 sat 94%
Risk Factors: Hypertension, smoking
"""

response = requests.post(
    'http://localhost:8000/analyze',
    json={'report_text': report}
)

result = response.json()
print(f"Diagnosis: {result['diagnosis']}")
print(f"Severity: {result['severity']}")
print(f"Urgency: {result['urgency']}")
print(f"Red Flags: {', '.join(result['red_flags'])}")
```

---

## 🐛 Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'google.generativeai'"

**Solution:**
```bash
pip install google-generativeai
# Or reinstall all:
pip install -r requirements.txt
```

### Issue: "GEMINI_API_KEY environment variable not set"

**Solution:**
1. Make sure `.env` file exists in ai-service directory
2. Check that it contains: `GEMINI_API_KEY=sk-...`
3. Restart the service with: `python main.py`

### Issue: "ModuleNotFoundError: No module named 'dotenv'"

**Solution:**
```bash
pip install python-dotenv
# Or:
pip install -r requirements.txt
```

### Issue: "Connection refused on localhost:8000"

**Solution:**
- Make sure you started the service: `python main.py`
- Check if port 8000 is in use
- Try different port: `uvicorn main:app --port 8080`

### Issue: "Key doesn't have permission to use Gemini API"

**Solution:**
1. Log in to https://ai.google.dev/
2. Delete old API key
3. Create new API key
4. Copy new key to `.env` file
5. Restart service

---

## 📚 Code Structure Explained

### medical_ai.py Functions:

```python
# Load embeddings from medical text
embeddings_list = get_embeddings("patient with chest pain")
# Returns: [0.12, -0.45, 0.89, ...] (768 floats)

# Classify which medical department
dept = classify_department(report_text)
# Returns: "Cardiology" or "Neurology" etc.

# Determine risk level
risk = classify_risk(report_text)
# Returns: "High" or "Medium" or "Low"

# Get AI analysis from Gemini
analysis = analyze_with_gemini(report, department, risk)
# Returns: {
#   "diagnosis": "...",
#   "severity": "...",
#   "urgency": "...",
#   "red_flags": [...],
#   "recommendations": "...",
#   "reasoning": "..."
# }
```

### main.py Endpoint:

```python
@app.post("/analyze")
async def analyze_medical_report(request):
    # Step 1: Classify department
    dept = classify_department(request.report_text)
    
    # Step 2: Classify risk
    risk = classify_risk(request.report_text)
    
    # Step 3: Call Gemini
    analysis = analyze_with_gemini(request.report_text, dept, risk)
    
    # Step 4: Return response
    return analysis
```

---

## 🚀 Integration with Backend

In your Node.js backend:

```javascript
// backend/services/aiService.js
export async function analyzeMedicalReport(reportText) {
  const response = await fetch('http://localhost:8000/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ report_text: reportText })
  });
  
  if (!response.ok) {
    throw new Error('AI analysis failed');
  }
  
  return response.json();  // Contains diagnosis, severity, etc.
}
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `.env` file exists with `GEMINI_API_KEY=sk-...`
- [ ] Virtual environment activated
- [ ] Service starts without errors: `python main.py`
- [ ] Can see "✓ BioLinkBERT loaded" in logs
- [ ] Can see "✓ Gemini API configured" in logs
- [ ] Health check works: `curl http://localhost:8000/health`
- [ ] Swagger UI loads: http://localhost:8000/docs
- [ ] Test request returns valid analysis

---

## 📊 Key Functions

### `get_embeddings(text: str) -> List[float]`
- Input: Medical text
- Output: 768-dimensional embedding (as Python list)
- Uses: BioLinkBERT CLS token

### `classify_department(report_text: str) -> str`
- Input: Medical report
- Output: One of 10 medical departments
- Method: Cosine similarity on embeddings

### `classify_risk(report_text: str) -> str`
- Input: Medical report
- Output: "High", "Medium", or "Low"
- Method: Keyword matching

### `analyze_with_gemini(report, department, risk) -> Dict`
- Input: Report text, department, risk level
- Output: Structured medical analysis
- Method: Gemini 1.5 Flash API with medical prompt

### POST `/analyze` Endpoint
- Input: `{"report_text": "..."}`
- Output: Complete medical analysis (JSON)
- Process: Calls all above functions in sequence

---

## 💡 Key Changes Made

1. ✅ **Import Updates**
   - Added `from dotenv import load_dotenv`
   - Added `import google.generativeai as genai`
   - Changed to `AutoTokenizer` and `AutoModel`

2. ✅ **Environment Setup**
   - Added `load_dotenv()` call
   - Added `GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")`
   - Proper error handling if key not found

3. ✅ **Gemini Configuration**
   - Added `genai.configure(api_key=GEMINI_API_KEY)`
   - Proper initialization at module load

4. ✅ **New Functions**
   - `get_embeddings(text)` - CLS token extraction
   - `analyze_with_gemini()` - Structured medical reasoning

5. ✅ **Updated Endpoint**
   - `/analyze` now calls: department → risk → Gemini
   - Returns structured response
   - Proper validation and error handling

6. ✅ **Files**
   - `.env` - Created with placeholder
   - `.env.example` - Updated template

---

## 🎯 Next Steps

1. **Now:**
   ```bash
   # Update .env with your Gemini API key
   # Then run:
   python main.py
   ```

2. **Test:**
   ```bash
   # New PowerShell:
   python test_api.py
   ```

3. **Integrate:**
   - Update backend routes to call AI service
   - Connect React frontend to backend

4. **Deploy:**
   - Docker when ready
   - Test in staging
   - Deploy to production

---

## 📞 Support

- **API Docs**: http://localhost:8000/docs
- **Health**: http://localhost:8000/health
- **Gemini API**: https://ai.google.dev/
- **Transformers**: https://huggingface.co/transformers/

---

**Status**: ✅ Production Ready | **Version**: 1.0.0 | **Date**: 2026-02-20

**You're all set! Start the service and begin analyzing medical reports with AI.** 🚀
