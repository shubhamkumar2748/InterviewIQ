import os
import json
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
import firebase_admin
from firebase_admin import credentials, firestore, auth
from backend.config import FIREBASE_CREDENTIALS_PATH, FIREBASE_PROJECT_ID, DATA_DIR
logger = logging.getLogger("interviewiq.firebase")
logging.basicConfig(level=logging.INFO)
class FirebaseService:
    def __init__(self):
        self.db = None
        self.is_firebase_active = False
        self.local_db_path = DATA_DIR / "interviews_store.json"
        self._init_firebase()
        self._init_local_store()
    def _init_firebase(self):
        """Attempt to initialize real Firebase Admin SDK if credentials exist."""
        try:
            if firebase_admin._apps:
                self.is_firebase_active = True
                self.db = firestore.client()
                logger.info("Firebase Admin already initialized.")
                return
            if FIREBASE_CREDENTIALS_PATH and os.path.exists(FIREBASE_CREDENTIALS_PATH):
                cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
                firebase_admin.initialize_app(cred, {
                    'projectId': FIREBASE_PROJECT_ID or None
                })
                  self.db = firestore.client()
                self.is_firebase_active = True
                logger.info("Firebase Admin SDK successfully connected with service account credentials.")
            elif FIREBASE_PROJECT_ID:
                firebase_admin.initialize_app(options={'projectId': FIREBASE_PROJECT_ID})
                self.db = firestore.client()
                self.is_firebase_active = True
                logger.info(f"Firebase Admin SDK initialized for project {FIREBASE_PROJECT_ID}.")
            else:
                logger.info("No Firebase credentials provided. Operating in high-performance local persistent JSON mode (zero setup required).")
        except Exception as e:
            logger.warning(f"Failed to initialize Firebase Admin SDK: {e}. Falling back to persistent local storage.")
            self.is_firebase_active = False
            self.db = None
    def _init_local_store(self):
        """Initialize local persistent JSON store."""
        if not self.local_db_path.exists():
            with open(self.local_db_path, "w", encoding="utf-8") as f:
                json.dump({"interviews": {}, "users": {}}, f, indent=2)
    def _read_local(self) -> Dict[str, Any]:
        try:
            with open(self.local_db_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {"interviews": {}, "users": {}}
    def _write_local(self, data: Dict[str, Any]):
        try:
            with open(self.local_db_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.error(f"Error writing to local JSON store: {e}")
    def save_interview(self, interview_data: Dict[str, Any]) -> bool:
        """Save an interview session (either in-progress or completed)."""
        interview_id = interview_data.get("id")
        if not interview_id:
            return False
           # If Firebase is active, persist to Firestore
        if self.is_firebase_active and self.db:
            try:
                self.db.collection("interviews").document(interview_id).set(interview_data, merge=True)
            except Exception as e:
                logger.error(f"Firestore save error: {e}")
        # Always also persist to local store for reliability and zero-latency caching
        store = self._read_local()
        store.setdefault("interviews", {})[interview_id] = interview_data
        self._write_local(store)
        return True
    def get_interview(self, interview_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve an interview by its ID."""
        if self.is_firebase_active and self.db:
            try:
                doc = self.db.collection("interviews").document(interview_id).get()
                if doc.exists:
                    return doc.to_dict()
            except Exception as e:
                logger.error(f"Firestore get error: {e}")
        # Check local store
        store = self._read_local()
        return store.get("interviews", {}).get(interview_id)
    def list_user_interviews(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all interviews completed by a specific user, ordered by creation time descending."""
        interviews = []
        if self.is_firebase_active and self.db:
            try:
                query = self.db.collection("interviews").where("user_id", "==", user_id).stream()
                for doc in query:
                    interviews.append(doc.to_dict())
            except Exception as e:
                logger.error(f"Firestore query error: {e}")
        # If empty or not using firebase, read from local
        if not interviews:
            store = self._read_local()
            all_interviews = store.get("interviews", {}).values()
            interviews = [
                item for item in all_interviews 
                        """Delete an interview from database."""
        if self.is_firebase_active and self.db:
            try:
                self.db.collection("interviews").document(interview_id).delete()
            except Exception as e:
                logger.error(f"Firestore delete error: {e}")
        store = self._read_local()
        if "interviews" in store and interview_id in store["interviews"]:
            del store["interviews"][interview_id]
            self._write_local(store)
            return True
        return False
    def save_dispute(self, dispute_data: Dict[str, Any]) -> bool:
        """Save a TrustScore dispute audit flag."""
        dispute_id = dispute_data.get("id", f"disp_{len(dispute_data)}")
        store = self._read_local()
        store.setdefault("disputes", {})[dispute_id] = dispute_data
        self._write_local(store)
        return True
    def list_disputes(self, user_id: str = "guest_user") -> List[Dict[str, Any]]:
        """List TrustScore audit disputes."""
        store = self._read_local()
        disputes = list(store.get("disputes", {}).values())
        return [d for d in disputes if d.get("user_id") in (user_id, "guest_user", "all", "")]
    def get_status(self) -> Dict[str, Any]:
        return {
            "mode": "firestore" if self.is_firebase_active else "local_json",
            "firebase_connected": self.is_firebase_active,
            "project_id": FIREBASE_PROJECT_ID or "local_embedded"
        }
firebase_service = FirebaseService()