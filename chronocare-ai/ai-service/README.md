# ChronoCare AI - Medical Analysis Service

Advanced medical report analysis using **BioLinkBERT embeddings** and **Google Gemini API** for clinical reasoning.

## 🏗️ Architecture Overview

```
User Medical Report
    ↓
[BioLinkBERT Embeddings]
    ↓
Generate Medical Embeddings (768-dim vectors)
    ↓
[Department Classification]
    ↓
Classify Medical Specialty (Cardiology, Neurology, etc)
    ↓
[Gemini API Medical Reasoning]
    ↓
Structured Medical Analysis JSON
    ↓
Return Comprehensive Analysis
```

### Pipeline Breakdown

1. **BioLinkBERT Embedding Generation** (medical_ai.py → `get_medical_embedding()`)
   - Loads pretrained BioLinkBERT model: `michiyasunaga/BioLinkBERT-base`
   - Tokenizes medical report text (max 512 tokens)
   - Generates 768-dimensional medical embeddings
   - Uses average pooling over token embeddings

2. **Medical Department Classification** (medical_ai.py → `classify_medical_department()`)
   - Computes cosine similarity between report embedding and department embeddings
   - Classifies to one of 10 medical specialties
   - Example specialties: Cardiology, Neurology, Emergency Medicine

3. **Gemini API Medical Reasoning** (medical_ai.py → `analyze_with_gemini()`)
   - Sends report + embeddings context to Gemini 1.5 Flash model
   - System prompt ensures medical accuracy and structured output
   - Gemini performs:
     - Clinical reasoning and diagnosis assessment
     - Severity classification (Critical/Severe/Moderate/Mild)
     - Urgency determination (Immediate/Urgent/Soon/Routine)
     - Red flag identification
     - Recommended medical actions

4. **Structured Output** (all data returned as JSON)
   ```json
   {
     "disease": "Primary diagnosis",
     "confidence": "High/Medium/Low",
     "severity": "Critical/Severe/Moderate/Mild",
     "department": "Medical specialty",
     "urgency": "Immediate/Urgent/Soon/Routine",
     "clinical_summary": "2-3 sentence summary",
     "recommended_action": "Specific next steps",
     "red_flags": ["Concerning symptom 1", "Concerning symptom 2"],
     "reasoning": "Detailed clinical reasoning"
   }
   ```

## 🚀 Quick Start

### 1. Prerequisites

- Python 3.8+
- pip/conda package manager
- Google Gemini API key (free at https://ai.google.dev/)

### 2. Install Dependencies

```bash
cd chronocare-ai/ai-service

# Install all required packages
pip install -r requirements.txt
```

**On Windows (CPU only, recommended):**
```bash
pip install transformers accelerate sentencepiece protobuf
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
pip install fastapi uvicorn google-generativeai python-dotenv
```

### 3. Set Up Gemini API Key

**Option A: Environment Variable (Recommended)**
```bash
# Windows PowerShell
$env:GEMINI_API_KEY="your_api_key_here"

# Windows CMD
set GEMINI_API_KEY=your_api_key_here

# Linux/Mac
export GEMINI_API_KEY="your_api_key_here"
```

**Option B: .env File**
```bash
# Copy template
cp .env.example .env

# Edit .env and add your Gemini API key
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Service

```bash
cd chronocare-ai/ai-service

# Start FastAPI server
python main.py
```

Server will start at: `http://localhost:8000`

API Documentation: `http://localhost:8000/docs` (Swagger UI)

## 📊 API Endpoints

### Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "message": "All systems operational"
}
```

### Analyze Medical Report
```bash
POST /analyze
```

Request:
```json
{
  "report_text": "Patient presents with chest pain and shortness of breath. BP: 150/90. Heart rate: 110 bpm."
}
```

Response:
```json
{
  "disease": "Acute Coronary Syndrome",
  "confidence": "High",
  "severity": "Critical",
  "department": "Cardiology",
  "urgency": "Immediate",
  "clinical_summary": "Patient presents with acute chest pain and dyspnea with elevated vital signs suggestive of acute coronary event.",
  "recommended_action": "Immediate cardiac evaluation, ECG, troponin markers, and cardiology consultation.",
  "red_flags": ["Chest pain", "Dyspnea", "Elevated heart rate", "Hypertension"],
  "reasoning": "Clinical presentation is highly concerning for acute coronary syndrome given chest pain, dyspnea, and vital sign abnormalities..."
}
```

### Using cURL
```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "report_text": "Patient presents with fever (39.2C), cough, and chest pain for 3 days. CXR shows infiltrates."
  }'
```

### Using Python
```python
import requests
import json

url = "http://localhost:8000/analyze"
payload = {
    "report_text": "Patient presents with fever and cough..."
}

response = requests.post(url, json=payload)
analysis = response.json()

print(json.dumps(analysis, indent=2))
```

## 📁 Project Structure

```
chronocare-ai/ai-service/
├── main.py                 # FastAPI server with /analyze endpoint
├── medical_ai.py           # Medical AI pipeline with BioLinkBERT + Gemini
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variable template
├── README.md               # This file
└── venv/                   # Virtual environment (created after pip install)
```

## 🔧 Configuration

### medical_ai.py

| Setting | Value | Purpose |
|---------|-------|---------|
| `BIOLINK_BERT_MODEL` | `michiyasunaga/BioLinkBERT-base` | Medical embedding model |
| `DEPARTMENTS` | List of 10 specialties | Department classification |
| `MAX_TOKENS` | 512 | Model input size limit |

### main.py

| Setting | Value | Purpose |
|---------|-------|---------|
| `HOST` | `0.0.0.0` | Bind to all interfaces |
| `PORT` | `8000` | FastAPI server port |
| `RELOAD` | `True` (dev), `False` (prod) | Auto-reload on code changes |

## 🔐 Security Considerations

### API Key Management

✅ **Good:**
- Use environment variables: `GEMINI_API_KEY`
- Use .env file (never commit to git)
- Use secrets management service in production

❌ **Never:**
- Hardcode API keys in code
- Commit .env file to version control
- Share API keys in logs

### CORS Configuration

Current setup allows all origins. For production:

```python
# main.py
CORSMiddleware configuration:
allow_origins=["https://your-frontend.com"]  # Specific domain
```

## 🧪 Testing

### Test Endpoint Availability
```bash
curl http://localhost:8000/health
```

### Test Medical Analysis
```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{"report_text": "Patient with chest pain and elevated troponin"}'
```

## 📚 Dependencies Explained

| Package | Version | Purpose |
|---------|---------|---------|
| `transformers` | 4.35.2 | Hugging Face transformers library for BioLinkBERT |
| `torch` | 2.1.1 | PyTorch for ML computations |
| `fastapi` | 0.104.1 | Modern Python web framework |
| `uvicorn` | 0.24.0 | ASGI server for FastAPI |
| `google-generativeai` | 0.3.0 | Google Gemini API client |
| `pydantic` | 2.5.0 | Data validation and serialization |
| `python-dotenv` | 1.0.0 | Load environment variables from .env |

## ⚠️ Troubleshooting

### "GEMINI_API_KEY environment variable not set"
```bash
# Check if api key is set
echo $GEMINI_API_KEY  # Linux/Mac
echo %GEMINI_API_KEY%  # Windows CMD
$env:GEMINI_API_KEY  # Windows PowerShell

# Set it
export GEMINI_API_KEY="sk-..."
```

### "BioLinkBERT model failed to load"
```bash
# Make sure transformers is installed
pip install transformers==4.35.2

# Try downloading model manually
python -c "from transformers import BertModel; BertModel.from_pretrained('michiyasunaga/BioLinkBERT-base')"
```

### Connection refused on localhost:8000
- Make sure port 8000 is not in use
- Try a different port: `uvicorn main:app --port 8080`

### Out of memory errors
- BioLinkBERT requires ~1GB RAM
- Ensure sufficient system memory available
- On limited systems, consider model quantization

### Gemini API rate limit
- Free tier has limited requests/minute
- Wait before retrying
- Consider upgrading API plan for production

## 🔄 Integration with Node.js Backend

In `chronocare-ai/backend/services/aiService.js`:

```javascript
async function analyzeReport(reportText) {
  const response = await fetch('http://localhost:8000/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ report_text: reportText })
  });
  
  if (!response.ok) throw new Error('Analysis failed');
  return await response.json();
}
```

## 📈 Performance Notes

- **First startup**: 1-2 minutes (model download + loading)
- **Per request latency**: 5-15 seconds (BioLinkBERT + Gemini API)
- **Memory usage**: ~2GB RAM for models
- **CPU usage**: ~50-80% during inference

## 🚀 Production Deployment

### Recommendations

1. **Use production ASGI server**: Gunicorn + Uvicorn
   ```bash
   pip install gunicorn
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
   ```

2. **Enable HTTPS**: Use reverse proxy (Nginx/Caddy)

3. **Add authentication**: API key validation

4. **Monitor performance**: Use APM tools

5. **Cache models**: Use Redis for embedding cache

6. **Rate limiting**: Implement request throttling

7. **Error tracking**: Use Sentry or similar

## 📝 License

ChronoCare AI - All Rights Reserved

## 🤝 Support

For issues or questions:
1. Check troubleshooting section
2. Review logs: `python main.py` shows detailed logs
3. Check API docs: http://localhost:8000/docs

---

**Version**: 1.0.0 | **Last Updated**: 2026-02-20
