from fastapi import FastAPI, UploadFile, File, HTTPException
import uuid
import os
from pathlib import Path
import whisper
from contextlib import asynccontextmanager


# Load Whisper model once at startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the Whisper model (choose appropriate size)
    app.state.whisper_model = whisper.load_model("base")  # or "small", "medium", etc.
    yield
    # Cleanup when shutting down
    del app.state.whisper_model


app = FastAPI(lifespan=lifespan)

UPLOAD_DIR = "audio_uploads"
Path(UPLOAD_DIR).mkdir(exist_ok=True)

MIME_MAP = {
    "audio/webm": "webm",
    "audio/ogg": "ogg",
    "audio/mp4": "mp4",
    "audio/wav": "wav",
}


@app.post("/convert/")
async def upload_and_transcribe(file: UploadFile = File(...)):
    try:
        # Process file upload
        raw_mime: str | None = file.content_type
        if not raw_mime:
            raise HTTPException(status_code=400, detail="Invalid MIME type")
        clean_mime = raw_mime.split(";")[0].strip().lower()
        extension = MIME_MAP.get(raw_mime) or MIME_MAP.get(clean_mime) or "webm"
        filename = f"{uuid.uuid4()}.{extension}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        # Save the file
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        # Transcribe with Whisper
        result = app.state.whisper_model.transcribe(file_path)

        return {
            "filename": filename,
            "transcription": result["text"],
            "language": result["language"],
            "processing_time": (
                result["segments"][0]["seek"] if result["segments"] else 0
            ),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
