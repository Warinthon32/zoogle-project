import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

BACKEND_URL = "http://localhost:5000"
MEDIA_BASE_URL = "http://127.0.0.1:5500/frontend/images/"

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads/animals")
UPLOAD_API = "/api/uploads/animals"
UPLOAD_PUBLIC_URL = BACKEND_URL + UPLOAD_API
