# 🚀 ChronoCare AI BioMistral - Quick Command Reference

## ⚡ Get Running in 5 Minutes

### 1️⃣ Install Ollama
Visit: **https://ollama.ai** and download for your OS

### 2️⃣ Download BioMistral Model
```bash
ollama pull biomistral:latest
```
⏱️ Time: 5-15 minutes (depends on internet)

### 3️⃣ Install Python Dependencies
```bash
# Activate virtual environment
.\..\..\.venv\Scripts\Activate.ps1  # Windows
# or
source ../../../.venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

### 4️⃣ Start the Service
```bash
python main.py
```

Expected output:
```
🚀 ChronoCare AI Medical Service Starting...
✓ BioLinkBERT model loaded
✓ BioMistral + Ollama configured (Local)
✓ No external APIs required
INFO: Uvicorn running on http://0.0.0.0:8000
INFO: Application startup complete
```

### 5️⃣ Test the API
**Option A: Browser (Recommended)**
```
http://localhost:8000/docs
```
Click "Try it out" on `/analyze` endpoint

**Option B: Command Line**
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"report_text":"Patient with chest pain"}'
```

**Option C: Health Check**
```bash
curl http://localhost:8000/health
```

---

## 📋 Complete Command Checklist

```bash
# === SETUP ===
# 1. Download Ollama from https://ollama.ai

# 2. Pull BioMistral
ollama pull biomistral:latest

# 3. Verify Ollama running
curl http://localhost:11434/api/tags

# 4. List models
ollama list

# === PYTHON SETUP ===
# 5. Go to ai-service directory
cd chronocare-ai\ai-service

# 6. Activate venv
.\..\..\.venv\Scripts\Activate.ps1  # Windows
source ../../../.venv/bin/activate  # macOS/Linux

# 7. Install Python packages
pip install -r requirements.txt

# === RUN SERVICE ===
# 8. Start FastAPI server
python main.py

# === TEST ===
# 9. Health check (in new terminal)
curl http://localhost:8000/health

# 10. Test analysis
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"report_text":"Patient presents with chest pain"}'

# === MONITORING ===
# 11. Check Ollama status
ollama ps

# 12. View model info
ollama show biomistral

# 13. Stop service
# Ctrl+C in terminal

# 14. Remove model (if needed)
ollama rm biomistral:latest
```

---

## 🔧 Troubleshooting Commands

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama (if not running)
ollama serve

# Verify BioMistral was downloaded
ollama list | grep biomistral

# Pull BioMistral again (if missing)
ollama pull biomistral:latest

# Check Python environment
python --version
pip list | grep -E "fastapi|ollama|torch"

# Test FastAPI health
curl http://localhost:8000/health

# Check if port 8000 is in use
netstat -ano | findstr :8000  # Windows
lsof -i :8000                  # macOS/Linux

# View service logs
tail -f logs/chronocare.log  # If logging to file
```

---

## 📦 Key Commands

| Command | Purpose |
|---------|---------|
| `ollama pull biomistral:latest` | Download model |
| `ollama list` | Show available models |
| `ollama ps` | Show running models |
| `ollama serve` | Start Ollama daemon |
| `ollama rm biomistral:latest` | Delete model |
| `python main.py` | Start ChronoCare AI |
| `pip install -r requirements.txt` | Install dependencies |
| `curl http://localhost:8000/docs` | API documentation |
| `curl http://localhost:8000/health` | Health check |

---

## 🚨 If Services Don't Start

### Ollama Won't Connect
```bash
# Terminal 1 - Start Ollama
ollama serve

# Terminal 2 - Verify connection
curl http://localhost:11434/api/tags
```

### BioMistral Model Missing
```bash
ollama pull biomistral:latest
ollama list
# Should show "biomistral:latest"
```

### FastAPI Service Crashes
```bash
# Check Python version (needs 3.8+)
python --version

# Verify dependencies installed
pip list

# Run with debug output
set DEBUG=True
python main.py
```

### Port Already in Use
```bash
# Windows - Find and kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux - Find and kill process on port 8000
lsof -i :8000
kill -9 <PID>
```

---

## 🎯 Test Requests

### Simple Health Check
```bash
curl http://localhost:8000/health
```

### Cardiac Emergency (Advanced Test)
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "report_text": "58-year-old patient with severe substernal chest pain (9/10) radiating to left arm, associated with dyspnea and diaphoresis. Chief complaint started 1 hour ago during activity. BP 165/95, HR 115, RR 24, O2 sat 92% on room air. History of hypertension, smoking 1 pack/day for 30 years, and family history of CAD. Recent stress at work. Initial troponin 0.5, elevated. ECG shows ST elevation in II, III, aVF."
  }'
```

### Respiratory Infection
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "report_text": "28-year-old presents with productive cough (yellow sputum), fever 38.5C, and dyspnea for 3 days. Also reports chest pain on deep breathing. WBC 12.5, CRP 45. Chest X-ray shows consolidation in left lower lobe. PCR testing positive for respiratory virus."
  }'
```

### Neurological Issue
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "report_text": "45-year-old with sudden onset severe headache with neck stiffness and photophobia. Temperature 39.2C, GCS 14. CSF bacterial culture pending. Started on empiric antibiotics. MRI shows no mass or hemorrhage."
  }'
```

---

## 📊 Performance Monitoring

```bash
# Monitor Ollama performance
watch -n 1 ollama ps

# Check memory usage
# Windows
tasklist | findstr ollama

# macOS/Linux
ps aux | grep ollama

# Real-time monitoring
watch -n 1 free -h  # Linux
```

---

## 🔗 Local URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **ChronoCare API** | http://localhost:8000 | Main service |
| **API Docs (Swagger)** | http://localhost:8000/docs | Interactive testing |
| **API Docs (ReDoc)** | http://localhost:8000/redoc | Alternative docs |
| **Health Check** | http://localhost:8000/health | Service status |
| **Ollama API** | http://localhost:11434 | Ollama server |

---

## ✅ Verification Checklist

```bash
# Run these commands in order to verify setup

# 1. Ollama installed
ollama --version

# 2. BioMistral downloaded
ollama list  # Should show biomistral

# 3. Ollama accessible
curl http://localhost:11434/api/tags

# 4. Python dependencies
pip list | grep -E "fastapi|ollama|torch|transformers"

# 5. Start service
python main.py

# 6. Service running (in new terminal)
curl http://localhost:8000/health

# 7. Test endpoint
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"report_text":"Test"}'
```

---

## 🎯 First Run Expected Results

✅ Ollama pulls BioMistral (5-15 min first time)
✅ FastAPI starts without errors
✅ `/health` endpoint returns `{"status":"healthy",...}`
✅ First `/analyze` takes 5-10 seconds (model warming up)
✅ Subsequent requests take 2-4 seconds
✅ Response contains all required fields

---

## 📱 API Request Format

### Request
```json
{
  "report_text": "Medical report text here..."
}
```

### Response
```json
{
  "diagnosis": "Clinical diagnosis",
  "severity": "Critical",
  "urgency": "Immediate",
  "department": "Cardiology",
  "red_flags": ["chest pain", "elevated troponin"],
  "recommendations": "Immediate ECG, cardiac markers...",
  "reasoning": "Clinical assessment..."
}
```

---

## 🚀 Production Deployment

### Docker
```bash
docker build -t chronocare:latest .
docker run -p 8000:8000 --gpus all chronocare:latest
```

### Docker Compose
```bash
docker-compose up -d
```

### Kubernetes
```bash
kubectl apply -f deployment.yaml
```

---

## 📺 Monitoring Dashboard

Create simple monitoring script:

```bash
# monitor.sh
while true; do
  clear
  echo "=== ChronoCare AI Status ==="
  echo ""
  echo "Ollama:"
  ollama ps
  echo ""
  echo "FastAPI Health:"
  curl -s http://localhost:8000/health | jq .
  echo ""
  echo "Python Process:"
  ps aux | grep main.py | grep -v grep
  sleep 5
done
```

Run with:
```bash
bash monitor.sh
```

---

## 🎓 Quick Tutorials

### Test via Swagger UI
1. Open http://localhost:8000/docs
2. Click on `/analyze` endpoint
3. Click "Try it out"
4. Edit the example text
5. Click "Execute"
6. View response

### Test via Python
```python
import requests

response = requests.post(
    "http://localhost:8000/analyze",
    json={"report_text": "Patient with chest pain"}
)

print(response.json())
```

### Test via JavaScript
```javascript
fetch('http://localhost:8000/analyze', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({report_text: 'Patient with chest pain'})
})
.then(r => r.json())
.then(data => console.log(data))
```

---

## 🔐 Security Check

```bash
# Verify no API keys in .env
cat .env  # Should NOT contain any API keys
grep -i "api_key\|gemini\|openai" .env  # Should return nothing

# Verify local-only processing
netstat -ano | findstr ESTABLISHED  # Should not show external APIs

# Check file permissions
ls -la .env  # Should be restricted permissions
```

---

## 📈 Performance Tuning

### For Faster Responses
```python
# In medical_ai.py, reduce output tokens
temperature=0.1,  # Lower = faster
num_predict=256   # Shorter responses
```

### For Better Accuracy
```python
temperature=0.3,  # Higher = more diverse
num_predict=512   # Longer responses
```

### For Lower Memory Usage
```bash
# Use CPU-only mode
export OLLAMA_NUM_GPU=0
ollama serve
```

---

## 🎉 Success Indicators

✅ No "API key not found" errors
✅ No "cannot connect to Gemini" messages
✅ No rate limit (429) errors
✅ Service responds within 5 seconds
✅ Memory usage stable at ~10 GB
✅ All analysis fields present in response

---

**Version:** 2.0.0
**Status:** ✅ Production Ready
**API:** Fully Local • No External Services • 100% Private

Ready to go! 🚀
