from fastapi import APIRouter, File, UploadFile, HTTPException, Request
import os
import tempfile
import time  # Import time for sleep
from pathlib import Path
from models.Class import Class
from models.Lecture import Lecture

router = APIRouter()

MIME_MAP = {
    "audio/webm": "webm",
    "audio/wav": "wav",
    "audio/mpeg": "mp3",
    "audio/mp4": "mp4",
    "audio/x-m4a": "m4a",
    "audio/ogg": "ogg",
}

UPLOAD_DIR = "audio_uploads"
Path(UPLOAD_DIR).mkdir(exist_ok=True)


@router.post("/convert/")
async def upload_and_transcribe(request: Request, file: UploadFile = File(...)):
    model = request.app.state.whisper_model

    raw_mime: str | None = file.content_type
    if not raw_mime:
        raise HTTPException(status_code=400, detail="Invalid file type.")

    clean_mime = raw_mime.split(";")[0].strip().lower()
    if clean_mime not in MIME_MAP:
        raise HTTPException(status_code=400, detail="Unsupported file type.")

    ext = MIME_MAP.get(clean_mime) or "wav"

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file.")

    # Use NamedTemporaryFile with proper flush and fsync for synchronization.
    with tempfile.NamedTemporaryFile(
        delete=False, suffix=f".{ext}", dir=UPLOAD_DIR
    ) as temp_file:
        temp_file.write(contents)
        temp_file.flush()
        os.fsync(temp_file.fileno())
        temp_file_path = temp_file.name

    time.sleep(1)  # Delay for 1 second

    transcription: str | None = None

    try:
        # Log file size for debugging purposes.
        file_size = os.path.getsize(temp_file_path)
        print(f"Processing file: {temp_file_path} ({file_size} bytes)")

        result = model.transcribe(temp_file_path)
        if not result:
            raise HTTPException(status_code=500, detail="Transcription failed.")

        transcription = result.get("text", "")
    except Exception as e:
        print(f"Error processing file: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

    if (not transcription) or (transcription == ""):
        raise HTTPException(status_code=500, detail="Transcription failed.")

    # the name if the first word of the transcription
    name = transcription.split(" ")[0]
    # what they said is what follows
    said = transcription[len(name) + 1 :]

    # upload to DB
    
    # 1. Check if the name already exists in the database
    # 2. If it does not, add the student to the class list
    Class.objects(name=)
