# ChronoCare AI - Architecture Documentation

## System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        CHRONOCARE AI SYSTEM                              │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                                 │
│                    src/pages/Upload.jsx                                  │
│                                                                          │
│  User uploads medical report (PDF/Text) → Sends to Node backend         │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                 BACKEND (Node.js + Express)                              │
│              backend/routes/reportRoutes.js                              │
│              backend/services/aiService.js                               │
│                                                                          │
│  POST /api/analyze → Forwards report to Python AI Service               │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
                         │ HTTP POST /analyze
                         │ { report_text: "..." }
                         ▼
┌────────────────────────────────────────────────────────────────────────────┐
│              PYTHON AI SERVICE (FastAPI) → main.py                         │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │  POST /analyze Endpoint - Medical Report Analysis Pipeline      │    │
│  │                                                                  │    │
│  │  1. RECEIVE REQUEST                                             │    │
│  │     ├─ Validate report_text (min 10 chars)                     │    │
│  │     └─ Log request metadata                                     │    │
│  │                                                                  │    │
│  │  2. BIOLINK BERT EMBEDDING GENERATION                          │    │
│  │     ├─ Load: michiyasunaga/BioLinkBERT-base                   │    │
│  │     ├─ Tokenize medical text (max 512 tokens)                 │    │
│  │     ├─ Generate 768-dimensional embeddings                     │    │
│  │     └─ Average pooling over token embeddings                   │    │
│  │                                                                  │    │
│  │  3. MEDICAL DEPARTMENT CLASSIFICATION                          │    │
│  │     ├─ Compute cosine similarity with dept embeddings          │    │
│  │     ├─ Select best matching specialty                          │    │
│  │     └─ Return one of 10 departments                            │    │
│  │  (Cardiology, Neurology, Dermatology, Orthopedics,            │    │
│  │   Emergency Medicine, Pulmonology, Infectious Disease,         │    │
│  │   Gastroenterology, Endocrinology, General Medicine)          │    │
│  │                                                                  │    │
│  │  4. GEMINI API MEDICAL REASONING                               │    │
│  │     ├─ System Prompt: "You are expert medical triage AI"       │    │
│  │     ├─ User Prompt: Report + embeddings context               │    │
│  │     ├─ Model: gemini-1.5-flash                                │    │
│  │     ├─ Temperature: 0.3 (medical accuracy)                    │    │
│  │     └─ Gemini analyzes clinical presentation                   │    │
│  │                                                                  │    │
│  │  5. STRUCTURED OUTPUT GENERATION                               │    │
│  │     ├─ Parse JSON response from Gemini                         │    │
│  │     ├─ Validate all required fields present                    │    │
│  │     ├─ Handle errors gracefully                                │    │
│  │     └─ Return structured analysis                              │    │
│  │                                                                  │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │  Output Format (JSON)                                            │    │
│  │  {                                                               │    │
│  │    "disease": "Primary diagnosis",                              │    │
│  │    "confidence": "High/Medium/Low",                             │    │
│  │    "severity": "Critical/Severe/Moderate/Mild",               │    │
│  │    "department": "Medical specialty",                           │    │
│  │    "urgency": "Immediate/Urgent/Soon/Routine",                │    │
│  │    "clinical_summary": "2-3 sentence summary",                 │    │
│  │    "recommended_action": "Specific next steps",                │    │
│  │    "red_flags": ["concerning symptom 1", "..."],              │    │
│  │    "reasoning": "Detailed clinical reasoning"                  │    │
│  │  }                                                               │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                            │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
                         │ JSON Response
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                 BACKEND (Node.js + Express)                              │
│                                                                          │
│  POST /api/analyze ← Receives structured analysis                        │
│                   ├─ Saves Report to MongoDB                             │
│                   ├─ Stores analysis results                             │
│                   ├─ Logs activity                                       │
│                   └─ Returns to frontend                                 │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                                    │
│            src/pages/Dashboard.jsx                                       │
│            src/components/RecentReports.jsx                              │
│                                                                          │
│  Display Results:                                                        │
│  • Medical analysis card                                                 │
│  • Red flags highlighted                                                 │
│  • Severity color-coded                                                  │
│  • Recommendation boxes                                                  │
│  • Clinical reasoning expandable                                         │
│  • Timeline view of all analyses                                         │
└─────────────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         MongoDB                                          │
│                                                                          │
│  Collections:                                                            │
│  ├─ reports: { _id, userId, reportText, analysis, timestamp }          │
│  ├─ users: { _id, name, email, medical_history }                       │
│  └─ activityLog: { userId, action, timestamp }                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Sequence

```
1. USER UPLOADS REPORT
   Front-end (Upload.jsx) → File upload/text input

2. FRONTEND SENDS TO BACKEND
   POST /api/reports/upload
   Body: { report_text: "..." }

3. BACKEND FORWARDS TO PYTHON AI SERVICE
   POST http://localhost:8000/analyze
   Body: { report_text: "..." }

4. AI SERVICE PROCESSES (5-15 seconds)
   ✓ Generate embeddings
   ✓ Classify department
   ✓ Call Gemini API
   ✓ Return JSON

5. BACKEND RECEIVES ANALYSIS
   {
     disease, confidence, severity, department,
     urgency, clinical_summary, recommended_action,
     red_flags, reasoning
   }

6. BACKEND PERSISTS TO DATABASE
   ✓ Create Report doc
   ✓ Store analysis
   ✓ Log activity
   ✓ Return to frontend

7. FRONTEND DISPLAYS RESULTS
   ✓ Show analysis cards
   ✓ Highlight red flags
   ✓ Color-code severity
   ✓ Display recommendations
```

---

## Component Interaction

```
PYTHON AI SERVICE (medical_ai.py)
├── Initialize()
│   ├─ Load BioLinkBERT model
│   └─ Configure Gemini API with secure key
│
├── perform_medical_analysis(report_text)
│   ├─ Step 1: get_medical_embedding(text)
│   │   ├─ Tokenize text
│   │   ├─ Forward through BioLinkBERT
│   │   └─ Return 768-dim embedding
│   │
│   ├─ Step 2: classify_medical_department(report_text)
│   │   ├─ Get report embedding
│   │   ├─ For each department:
│   │   │   ├─ Get dept embedding
│   │   │   ├─ Calculate cosine similarity
│   │   │   └─ Track best match
│   │   └─ Return best_department
│   │
│   └─ Step 3: analyze_with_gemini(report, embeddings, dept)
│       ├─ Create medical system prompt
│       ├─ Create user prompt with context
│       ├─ Call Gemini 1.5 Flash model
│       ├─ Parse JSON response
│       └─ Return structured analysis
│
└─ Exception Handling
    ├─ Model loading errors → log & exit
    ├─ API errors → return error JSON
    └─ Parse errors → attempt recovery
```

---

## Technology Stack

```
FRONTEND
├─ React 18+
├─ Vite (build tool)
├─ Axios (HTTP client)
└─ Tailwind CSS (styling)

BACKEND
├─ Node.js + Express
├─ MongoDB (database)
├─ JWT (authentication)
└─ Multer (file uploads)

AI SERVICE
├─ Python 3.11
├─ FastAPI (web framework)
├─ Uvicorn (ASGI server)
├─ Transformers (HuggingFace)
├─ PyTorch (ML framework)
├─ Google Generative AI (Gemini)
└─ Pydantic (data validation)

DEPLOYMENT
├─ Docker (containerization)
├─ Gunicorn (production server)
├─ Nginx (reverse proxy)
└─ AWS/GCP (cloud hosting)
```

---

## Security Architecture

```
API KEY MANAGEMENT
├─ Environment variable: GEMINI_API_KEY
├─ Never hardcoded
├─ .env for development
└─ Secrets manager for production

AUTHENTICATION
├─ JWT tokens
├─ User login required
└─ ProtectedRoute wrapper

DATA PROTECTION
├─ MongoDB encryption at rest
├─ HTTPS in production
├─ CORS validation
└─ Input sanitization

AUDIT LOGGING
├─ All analyses logged
├─ Timestamp tracking
├─ User attribution
└─ Activity timeline
```

---

## Error Handling Flow

```
REQUEST ARRIVES
    ↓
VALIDATE INPUT
    ├─ Too short? ❌ 400 Bad Request
    ├─ Invalid format? ❌ 422 Unprocessable
    └─ Valid? ✓ Continue
    ↓
EMBEDDING GENERATION
    ├─ Model error? ❌ 500 Server Error
    └─ Success? ✓ Continue
    ↓
GEMINI API CALL
    ├─ API error? ❌ 503 Service Unavailable
    ├─ Parse error? ❌ 500 Server Error
    └─ Success? ✓ Continue
    ↓
RESPONSE VALIDATION
    ├─ Missing fields? ❌ 500 Server Error
    └─ Complete? ✓ Continue
    ↓
RETURN ANALYSIS ✓ 200 OK
```

---

## Performance Optimization

```
MODEL LOADING (First Startup)
├─ BioLinkBERT: ~700MB download
├─ Load time: ~30 seconds
└─ Cached in memory

PER-REQUEST OPTIMIZATION
├─ Batch embeddings: ✓ (if needed)
├─ Cache dept embeddings: ✓ (10 fixed)
├─ Async Gemini calls: ✓
└─ Connection pooling: ✓

SCALING CONSIDERATIONS
├─ Multiple workers (Gunicorn -w 4)
├─ Load balancing (Nginx round-robin)
├─ Caching layer (Redis)
└─ Queue system (Celery) for heavy loads
```

---

## Monitoring & Observability

```
LOGGING
├─ All requests logged
├─ Response times tracked
├─ Errors captured
└─ API key never logged

METRICS
├─ Request count
├─ Response latency
├─ Error rate
├─ Model load time
└─ API quota usage

ALERTING
├─ Service down
├─ High error rate
├─ API rate limit
└─ Out of memory
```

---

## Integration Points

```
FRONTEND → BACKEND
POST /api/analyze
├─ Request: { report_text, file_id }
└─ Response: { analysis, status }

BACKEND → AI SERVICE
POST http://localhost:8000/analyze
├─ Request: { report_text }
└─ Response: { disease, confidence, severity, ... }

BACKEND → MONGODB
insertOne(Report)
├─ Save original report
├─ Store analysis results
└─ Log timestamps & user info
```

---

**Version 1.0.0** | Last Updated: 2026-02-20 | Status: Production Ready
