import os
import uuid
from werkzeug.utils import secure_filename
import config
import hashlib, time


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE_MB = 5  # ขนาดไฟล์สูงสุด (MB)



def allowed_file(filename: str) -> bool:
    return (
        '.' in filename and
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    )


def allowed_size(file) -> bool:
    file.seek(0, os.SEEK_END)          # เลื่อนไปท้ายไฟล์
    size_mb = file.tell() / (1024 * 1024)
    file.seek(0)                       # reset กลับต้น
    return size_mb <= MAX_FILE_SIZE_MB


def delete_animal_files(animal_id: int):
    if not os.path.exists(config.UPLOAD_FOLDER):
        print("No folder path:", config.UPLOAD_FOLDER)
        return
    
    prefix = f"{animal_id}_"

    for filename in os.listdir(config.UPLOAD_FOLDER):
        if filename.startswith(prefix):
            file_path = os.path.join(config.UPLOAD_FOLDER, filename)

            if os.path.isfile(file_path):
                os.remove(file_path)

def generate_filename(original_filename: str, animal_id = 0) -> str:
    safe_name = secure_filename(original_filename)

    # เอานามสกุล
    if '.' in safe_name:
        ext = safe_name.rsplit('.', 1)[1].lower()
    else:
        ext = 'jpg'

    # hash จากชื่อไฟล์
    name_hash = hashlib.md5(safe_name.encode()).hexdigest()[:6]

    # random กันชน
    rand = uuid.uuid4().hex[:8]

    return f"{animal_id}_{name_hash}{rand}.{ext}"


def save_upload(file, animal_id = 0) -> dict:
    if not file or file.filename == '':
        raise ValueError("No file provided")

    # ตรวจนามสกุล
    if not allowed_file(file.filename):
        raise ValueError(
            f"File type not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # ตรวจขนาด
    if not allowed_size(file):
        raise ValueError(f"File too large. Max size: {MAX_FILE_SIZE_MB}MB")

    # สร้างชื่อ + path
    filename = generate_filename(file.filename, animal_id)
    filepath = os.path.join(config.UPLOAD_FOLDER, filename)

    # สร้าง folder ถ้ายังไม่มี
    os.makedirs(config.UPLOAD_FOLDER, exist_ok=True)

    # บันทึกไฟล์
    file.save(filepath)

    return {
        "filename": filename,
        "filepath": filepath
    }