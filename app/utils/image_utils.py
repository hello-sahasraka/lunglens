import os
from fastapi import File, UploadFile
import uuid
import aiofiles

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


async def save_image(ct_scan: UploadFile = File(...)):
    ext = os.path.splitext(ct_scan.filename)[
        1
    ]  # Keep original extension (.png, .jpg, etc.)
    unique_filename = f"{uuid.uuid4().hex}{ext}"

    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    async with aiofiles.open(file_path, "wb") as f:
        await f.write(await ct_scan.read())
    return file_path


def delete_image(ct_image_path: str | None):
    if ct_image_path and os.path.exists(ct_image_path):
        try:
            os.remove(ct_image_path)
            print(f"Deleted temp file: {ct_image_path}")
        except Exception as e:
            print(f"Error deleting file {ct_image_path}: {e}")
