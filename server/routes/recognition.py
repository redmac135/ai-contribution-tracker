from fastapi import APIRouter, File, UploadFile, HTTPException, Request
import os
import tempfile
import time  # Import time for sleep
from pathlib import Path
from models.Class import Class
from models.Lecture import Lecture, Contribution
import re

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


def extract_name_and_speech(input_string):
    # Define a regular expression pattern
    pattern = r"^([A-Za-z]+(?:'[A-Za-z]+)?(?:-[A-Za-z]+)*)(?:[.,!?;]*)(\s.*)?$"
    match = re.match(pattern, input_string.strip())
    if match:
        name = match.group(1).strip()
        speech = match.group(2).strip() if match.group(2) else ""
        return name, speech
    else:
        return None, None


@router.get("/classnames/")
async def classNames():
    """
    Returns a list of all class names in the database.
    """
    class_names = Class.objects().distinct("name")
    return {"class_names": class_names}


@router.post("/convert/")
async def upload_and_transcribe(
    request: Request, section: str, file: UploadFile = File(...)
):
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
    name, said = extract_name_and_speech(transcription)

    if (not name) or (not said):
        return {
            "name": "Unknown",
            "said": "Unknown",
        }

    # upload to DB

    # 1. Check if the name already exists in the database
    class_object = Class.objects(name=section).first()

    if not class_object:
        class_object = Class(name=section, students=[name]).save()

    students = class_object.students
    # 2. If it does not, add the student to the class list
    if name not in students:
        class_object.students.append(name)
        class_object.save()

    # 3. Check if lecture object exists for this day
    lecture_object = Lecture.objects(
        class_name=section, date=time.strftime("%Y-%m-%d")
    ).first()

    # contribution object
    contribution = Contribution(
        name=name,
        said=said,
        score=1,
    )

    if not lecture_object:
        lecture_object = Lecture(
            class_name=section,
            date=time.strftime("%Y-%m-%d"),
            contrib=[
                contribution,
            ],
        )

        lecture_object.save()

    else:
        # 4. If it does, add the contribution to the lecture object
        lecture_object.contrib.append(contribution)
        lecture_object.save()

    return {"name": name, "said": said}
