import os
from pathlib import Path
from dotenv import load_dotenv
# Load .env file
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID", "")
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "")
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)
# Default to Gemini 2.5 Flash for fast, accurate mock interview intelligence
DEFAULT_GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")