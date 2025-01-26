from fastapi import FastAPI, UploadFile, File, HTTPException
import uuid
import os
from pathlib import Path

app = FastAPI()

UPLOAD_DIR = "audio_uploads"
Path(UPLOAD_DIR).mkdir(exist_ok=True)

# Expanded MIME type to extension mapping
MIME_MAP = {
    # Chrome, Edge, Brave
    "audio/webm": "webm",
    "audio/webm; codecs=opus": "webm",
    # Firefox
    "audio/ogg": "ogg",
    "audio/ogg; codecs=opus": "ogg",
    # Safari
    "audio/mp4": "mp4",
    "audio/aac": "aac",
    # WAV fallback
    "audio/wav": "wav",
    "audio/x-wav": "wav",
}


@app.post("/convert/")
async def upload_audio(file: UploadFile = File(...)):
    try:
        # Clean MIME type by splitting off parameters
        raw_mime: str | None = file.content_type
        if not raw_mime:
            raise HTTPException(status_code=400, detail="Invalid MIME type")
        clean_mime = raw_mime.split(";")[0].strip().lower()

        # Get extension from mapping or default to webm
        extension = MIME_MAP.get(raw_mime) or MIME_MAP.get(clean_mime) or "webm"

        # Generate safe filename
        filename = f"{uuid.uuid4()}.{extension}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        # Save file
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        return {"filename": filename, "mime_type": raw_mime, "extension": extension}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

