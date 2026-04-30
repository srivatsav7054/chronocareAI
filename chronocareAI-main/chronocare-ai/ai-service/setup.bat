@echo off
REM ChronoCare AI - Setup Script for Windows
REM Installs all dependencies and configures the environment

echo.
echo ================================================================================
echo ChronoCare AI - Medical Analysis Service Setup
echo ================================================================================
echo.

echo Step 1: Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.8+
    exit /b 1
)

echo.
echo Step 2: Creating virtual environment...
python -m venv venv
call venv\Scripts\activate.bat

echo.
echo Step 3: Upgrading pip...
python -m pip install --upgrade pip

echo.
echo Step 4: Installing core dependencies...
pip install fastapi uvicorn pydantic pydantic-settings python-dotenv

echo.
echo Step 5: Installing transformers and medical models...
pip install transformers==4.35.2 accelerate sentencepiece protobuf

echo.
echo Step 6: Installing PyTorch (CPU version - recommended)...
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

echo.
echo Step 7: Installing Gemini API client...
pip install google-generativeai

echo.
echo Step 8: Installing additional utilities...
pip install requests aiofiles python-multipart

echo.
echo ================================================================================
echo SETUP COMPLETE
echo ================================================================================
echo.
echo Next steps:
echo 1. Get your Gemini API key from https://ai.google.dev/
echo 2. Set environment variable: set GEMINI_API_KEY=your_key_here
echo 3. Run the service: python main.py
echo.
echo To activate virtual environment in future:
echo   venv\Scripts\activate.bat
echo.
