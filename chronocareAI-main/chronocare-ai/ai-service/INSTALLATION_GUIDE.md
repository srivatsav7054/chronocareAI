# ChronoCare AI - Installation & Setup Guide

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Quick Setup (Windows)](#quick-setup-windows)
3. [Manual Installation](#manual-installation)
4. [Environment Configuration](#environment-configuration)
5. [Getting Gemini API Key](#getting-gemini-api-key)
6. [Running the Service](#running-the-service)
7. [Verification & Testing](#verification--testing)
8. [Docker Deployment](#docker-deployment)
9. [Troubleshooting](#troubleshooting)

---

## 🖥️ System Requirements

### Minimum
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 20.04+
- **Python**: 3.8 - 3.11
- **RAM**: 4GB (8GB+ recommended)
- **Disk**: 5GB free space (for models)
- **Internet**: Required (model downloads + Gemini API)

### Recommended
- **OS**: Windows 11 / Ubuntu 22.04 LTS
- **Python**: 3.11
- **RAM**: 16GB
- **Disk**: 10GB SSD
- **GPU**: NVIDIA (optional, for faster inference)

---

## ⚡ Quick Setup (Windows)

### Automated Setup (Easiest)

1. **Open PowerShell in ai-service directory:**
   ```powershell
   cd chronocare-ai\ai-service
   ```

2. **Run setup script:**
   ```powershell
   .\setup.bat
   ```

3. **Set Gemini API Key:**
   ```powershell
   $env:GEMINI_API_KEY="your_api_key_here"
   ```

4. **Activate virtual environment:**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

5. **Run the service:**
   ```powershell
   python main.py
   ```

### Manual Setup (Alternative)

```powershell
# Navigate to project
cd chronocare-ai\ai-service

# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Set API key
$env:GEMINI_API_KEY="your_key_here"

# Run
python main.py
```

---

## 💻 Manual Installation

### Step 1: Install Python

**Windows:**
- Download from [python.org](https://www.python.org/downloads/)
- Run installer, check "Add Python to PATH"
- Verify: `python --version`

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
python3 --version
```

**macOS:**
```bash
brew install python@3.11
python3 --version
```

### Step 2: Create Virtual Environment

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate.bat

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
# Upgrade pip first
pip install --upgrade pip

# Install from requirements.txt
pip install -r requirements.txt
```

### Step 4: Verify Installation

```bash
# Check transformers
python -c "from transformers import BertModel; print('✓ Transformers OK')"

# Check torch
python -c "import torch; print(f'✓ PyTorch OK - CPU: {torch.cuda.is_available()}')"

# Check FastAPI
python -c "import fastapi; print('✓ FastAPI OK')"

# Check Gemini
python -c "import google.generativeai; print('✓ Gemini API OK')"
```

---

## 🔑 Environment Configuration

### Get Gemini API Key

1. Visit [ai.google.dev](https://ai.google.dev/)
2. Click "Get API Key"
3. Create new API key in Google Cloud Console
4. Copy the key

### Set Environment Variable

**Windows PowerShell:**
```powershell
$env:GEMINI_API_KEY="your_api_key_here"
# Verify
$env:GEMINI_API_KEY
```

**Windows CMD:**
```cmd
set GEMINI_API_KEY=your_api_key_here
echo %GEMINI_API_KEY%
```

**Linux/Mac:**
```bash
export GEMINI_API_KEY="your_api_key_here"
echo $GEMINI_API_KEY
```

**Persistent Setup (.env file):**

1. **Create `.env` file:**
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

2. **Python will auto-load it:**
   ```bash
   pip install python-dotenv
   ```

3. **In code:**
   ```python
   from dotenv import load_dotenv
   load_dotenv()
   ```

---

## 🎯 Getting Gemini API Key

### Free Tier Setup

1. Go to [https://ai.google.dev/](https://ai.google.dev/)
2. Click "Get API Key" button
3. Select "Create API Key"
4. Choose "Create API key in new project"
5. Copy the generated key
6. Keep it safe (don't share!)

### Verify Key Works

```bash
python -c "
import os
os.environ['GEMINI_API_KEY'] = 'your_key_here'
import google.generativeai as genai
genai.configure(api_key=os.environ['GEMINI_API_KEY'])
model = genai.GenerativeModel('gemini-1.5-flash')
response = model.generate_content('Hello')
print('✓ API Key works!')
"
```

---

## 🚀 Running the Service

### Development Mode

```bash
# Activate virtual environment
.\venv\Scripts\activate.bat  # Windows
source venv/bin/activate      # Linux/Mac

# Set API key
$env:GEMINI_API_KEY="your_key"  # Windows
export GEMINI_API_KEY="your_key"  # Linux/Mac

# Run with auto-reload
python main.py
```

**Output:**
```
ChronoCare AI - Medical Analysis Service
Starting FastAPI server on http://localhost:8000
API Documentation: http://localhost:8000/docs
```

### Production Mode

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn -c gunicorn_config.py main:app

# Or with specific workers
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
```

### Docker Mode

```bash
# Build image
docker build -t chronocare-ai:latest .

# Run container
docker run -p 8000:8000 \
  -e GEMINI_API_KEY="your_key_here" \
  chronocare-ai:latest

# Or with docker-compose
docker-compose up -d
```

---

## ✅ Verification & Testing

### Check Service Health

**Browser:**
- Open http://localhost:8000/docs (Swagger UI)
- Click "Try it out" buttons

**cURL:**
```bash
curl http://localhost:8000/health
```

**Python:**
```python
import requests
response = requests.get('http://localhost:8000/health')
print(response.json())
```

### Full API Test

```bash
# Run test suite
python test_api.py
```

**Expected output:**
```
TEST 1: Health Check
Status Code: 200
Response: {'status': 'healthy', 'message': 'All systems operational'}

TEST: Cardiac Emergency Case
Status Code: 200
Analysis Result:
  Disease: Acute Coronary Syndrome
  Confidence: High
  ...
```

---

## 🐳 Docker Deployment

### Build Docker Image

```bash
# From ai-service directory
docker build -t chronocare-ai-service:latest .

# Verify build
docker images | grep chronocare
```

### Run Docker Container

```bash
# Basic run
docker run -p 8000:8000 \
  -e GEMINI_API_KEY="your_key_here" \
  chronocare-ai-service:latest

# With docker-compose
docker-compose up -d

# View logs
docker-compose logs -f chronocare-ai-service

# Stop service
docker-compose down
```

### Docker Compose Deployment on Server

```bash
# Create folder on server
mkdir -p /opt/chronocare-ai
cd /opt/chronocare-ai

# Copy files
scp -r ./ai-service/* user@server:/opt/chronocare-ai/

# Create .env on server
echo "GEMINI_API_KEY=your_key" > .env

# Run
docker-compose up -d

# Monitor
docker logs chronocare-ai-medical-service -f
```

---

## 🔧 Troubleshooting

### "ModuleNotFoundError: No module named 'transformers'"

```bash
# Install transformers
pip install transformers==4.35.2

# Verify
python -c "import transformers; print(transformers.__version__)"
```

### "GEMINI_API_KEY not set"

```bash
# Check environment variable
echo %GEMINI_API_KEY%  # Windows
echo $GEMINI_API_KEY   # Linux

# Set it
set GEMINI_API_KEY=your_key  # Windows
export GEMINI_API_KEY="your_key"  # Linux

# Verify
python -c "import os; print(os.getenv('GEMINI_API_KEY'))"
```

### "Connection refused" on localhost:8000

1. **Check if service is running:**
   ```bash
   netstat -ano | findstr :8000  # Windows
   lsof -i :8000                 # Linux/Mac
   ```

2. **Change port:**
   ```bash
   uvicorn main:app --port 8080
   ```

3. **Check firewall:**
   - Windows: Allow Python through firewall
   - Linux: `sudo ufw allow 8000`

### "Out of memory" errors

```bash
# Check available RAM
wmic OS get totalvisiblememory  # Windows
free -h                          # Linux

# Close unnecessary applications
# Consider using GPU acceleration
```

### "BioLinkBERT download timeout"

```bash
# Manually download model
python -c "
from transformers import BertModel, BertTokenizer
model_name = 'michiyasunaga/BioLinkBERT-base'
BertTokenizer.from_pretrained(model_name)
BertModel.from_pretrained(model_name)
print('✓ Model downloaded')
"

# Try again
python main.py
```

### "Gemini API rate limit"

Free tier: 60 requests/minute

```python
import time
time.sleep(60)  # Wait before retry
```

Upgrade to paid plan for higher limits.

### "Invalid API key"

1. Verify key from [ai.google.dev](https://ai.google.dev/)
2. Check no extra spaces: `GEMINI_API_KEY="key_only"`
3. Ensure key is still active
4. Generate new key if needed

### Linux: "Permission denied"

```bash
# Make scripts executable
chmod +x setup.sh
chmod +x *.py

# Run with python
python main.py
```

---

## 📊 Performance Tuning

### Optimize for Fast Inference

```python
# In medical_ai.py
import torch
torch.set_num_threads(4)  # Limit CPU threads
```

### Enable Model Caching

```python
import torch
torch.cuda.empty_cache()  # If using GPU
```

### Batch Processing (Future Enhancement)

```python
# For multiple reports
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=4) as executor:
    results = executor.map(perform_medical_analysis, reports)
```

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Transformers Documentation](https://huggingface.co/docs/transformers/)
- [Google Gemini API](https://ai.google.dev/)
- [PyTorch Documentation](https://pytorch.org/docs/stable/index.html)

---

## ✨ Next Steps

1. ✅ Installation complete
2. 🚀 Service running on http://localhost:8000
3. 📊 Test with `python test_api.py`
4. 🔗 Integrate with Node.js backend
5. 🐳 Deploy with Docker to production

**Questions?** Check README.md or enable DEBUG logging:

```bash
LOG_LEVEL=DEBUG python main.py
```

---

**Version**: 1.0.0 | **Last Updated**: 2026-02-20
