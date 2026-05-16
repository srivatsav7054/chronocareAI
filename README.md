# ChronoCare AI: Clinical Decision Support & Health Intelligence

ChronoCare AI is a premium medical platform designed to automate clinical report analysis, intelligent patient routing, and long-term health tracking. It utilizes local LLMs (Mistral via Ollama) and BioLinkBERT for high-precision clinical reasoning without sending data to external APIs.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js** (v18+)
- **Python** (3.9+)
- **Ollama** ([Download here](https://ollama.com/))
- **MongoDB** (Local or Atlas)

### 2. Local AI Setup
ChronoCare uses Mistral (4.5GB) for robust clinical reasoning.
```powershell
# 1. Start Ollama
ollama serve

# 2. Pull the required model
ollama pull mistral
```

### 3. Installation & Execution

#### **A. AI Analysis Service (Python)**
This service handles medical context extraction and clinical reasoning.
```powershell
cd ai-service
pip install -r requirements.txt
python main.py
```
*Wait for "Application startup complete" (loads BioLinkBERT).*

#### **B. Backend Server (Node.js)**
Handles authentication, report storage, and clinical routing.
```powershell
cd backend
npm install
npm start
```

#### **C. Frontend Application (React/Vite)**
The premium user interface.
```powershell
# In the root directory
npm install
npm run dev
```

---

## 🏥 Clinical Workflow

ChronoCare AI implements a high-fidelity "Doctor-in-the-loop" workflow:

1.  **Patient Upload**: Patient uploads a PDF/Image or pastes medical text.
2.  **AI Extraction**: BioLinkBERT extracts clinical features, and Mistral generates a preliminary analysis (Diagnosis, Severity, Urgency).
3.  **Intelligent Routing**: Reports are automatically routed to the correct hospital department (e.g., Cardiology, Gastroenterology).
4.  **Clinical Review**: Doctors access the **Doctor Portal**, review AI findings, and add their formal clinical notes.
5.  **Health Intelligence**: All reviews contribute to the **Health Score Dashboard**, providing patients with trend analysis and clinical forecasts.

---

## 🛠 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Node.js, Express, MongoDB, JWT Authentication.
- **AI Core**: 
  - **FastAPI** (Service Layer)
  - **Ollama** (Mistral for text generation)
  - **Transformers** (BioLinkBERT for medical embeddings)

---

## ⚠️ Important Note on Memory
If you encounter a "Bind Error" on Port 11434, it means Ollama is already running in the background. You can skip the `ollama serve` step and proceed to starting the Python service.
