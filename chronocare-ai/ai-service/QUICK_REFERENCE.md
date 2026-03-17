# 🏥 ChronoCare AI - Quick Reference Card

## 🚀 Quick Start (Windows)

```powershell
# 1. Navigate to service
cd chronocare-ai\ai-service

# 2. Run setup (installs everything)
.\setup.bat

# 3. Get Gemini API key from https://ai.google.dev/

# 4. Set key
$env:GEMINI_API_KEY="your_key_here"

# 5. Activate virtual environment
.\venv\Scripts\Activate.ps1

# 6. Run service
python main.py

# 7. Test (in another window)
python test_api.py
```

## 📍 Access Points

| Resource | URL |
|----------|-----|
| API Root | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |
| Health Check | http://localhost:8000/health |

## 🔑 Endpoints

### POST /analyze
Analyze medical report and get structured AI analysis

**Request:**
```json
{
  "report_text": "Patient presents with chest pain..."
}
```

**Response:**
```json
{
  "disease": "Acute Coronary Syndrome",
  "confidence": "High",
  "severity": "Critical",
  "department": "Cardiology",
  "urgency": "Immediate",
  "clinical_summary": "...",
  "recommended_action": "...",
  "red_flags": ["..."],
  "reasoning": "..."
}
```

## 🧪 Test Commands

### cURL
```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{"report_text": "Patient with chest pain"}'
```

### Python
```python
import requests
r = requests.post('http://localhost:8000/analyze',
  json={'report_text': 'Patient with fever and cough'})
print(r.json())
```

### Swagger UI
1. Go to http://localhost:8000/docs
2. Find /analyze endpoint
3. Click "Try it out"
4. Enter medical text
5. Click "Execute"

## 🔐 Environment Setup

### Option 1: PowerShell Variable (Session Only)
```powershell
$env:GEMINI_API_KEY="sk-..."
```

### Option 2: .env File (Persistent)
```bash
# Create .env file
GEMINI_API_KEY=sk-...
```

### Option 3: CMD (Session Only)
```cmd
set GEMINI_API_KEY=sk-...
```

## 📋 File Structure

```
ai-service/
├── main.py              → FastAPI server
├── medical_ai.py        → AI engine
├── requirements.txt     → Dependencies
├── test_api.py          → Test suite
├── .env.example         → Config template
└── README.md            → Full docs
```

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Module not found | `pip install -r requirements.txt` |
| API key not set | `$env:GEMINI_API_KEY="your_key"` |
| Port 8000 in use | `uvicorn main:app --port 8080` |
| Connection refused | Ensure service is running |
| Out of memory | Close other apps or use GPU |

## 📊 Pipeline Overview

```
Report Text → BioLinkBERT → Embeddings → Gemini API → Analysis JSON
```

## 🔄 Integration Code

### Node.js Backend
```javascript
const response = await fetch('http://localhost:8000/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ report_text: reportText })
});
const analysis = await response.json();
```

## ⚡ Performance

| Metric | Value |
|--------|-------|
| Startup | 1-2 min |
| Per Request | 5-15s |
| Memory | ~2GB |
| Models | BioLinkBERT, Gemini 1.5 |

## 🎯 Medical Departments Supported

Cardiology, Neurology, Dermatology, Orthopedics, Emergency Medicine, Pulmonology, Infectious Disease, Gastroenterology, Endocrinology, General Medicine

## 📦 Deployment

### Local
```bash
python main.py
```

### Production
```bash
gunicorn -c gunicorn_config.py main:app
```

### Docker
```bash
docker build -t chronocare-ai .
docker run -p 8000:8000 -e GEMINI_API_KEY=your_key chronocare-ai:latest
```

### Docker Compose
```bash
docker-compose up -d
```

---

**Version 1.0.0** | For detailed docs see README.md
