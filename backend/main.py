from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import uuid
import os
from pathlib import Path
import whisper
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from pydantic import BaseModel, Field
import requests
from dotenv import load_dotenv
from pymongo import MongoClient


load_dotenv()

# Will need to hide MongoDB aicontributor password
uri = os.getenv("MONGO_URI")

# Setting up the MongoDB client
client = MongoClient(uri, server_api=ServerApi("1"))

# Send a ping to confirm a successful connection
try:
    client.admin.command("ping")
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client.get_database("StudentTracker")

# Collection name is "Responses"


class Student(BaseModel):
    id: str
    name: str
    contribution: int


# Load Whisper model once at startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the Whisper model (choose appropriate size)
    app.state.whisper_model = whisper.load_model("base")  # or "small", "medium", etc.
    yield
    # Cleanup when shutting down
    del app.state.whisper_model


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only, specify exact origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = "audio_uploads"
Path(UPLOAD_DIR).mkdir(exist_ok=True)

MIME_MAP = {
    "audio/webm": "webm",
    "audio/ogg": "ogg",
    "audio/mp4": "mp4",
    "audio/wav": "wav",
}


@app.post("/student/")
async def create_student(student: Student):
    try:
        db = client.get_database("ai_contributor")
        students_collection = db["StudentDB"]
        # Convert Pydantic model to dict
        # student_dict = student.model_dump()
        student_dict = {"name": "John Doe", "contribution": 0}

        result = students_collection.insert_one(student_dict)
        student_dict = {
            key: str(value) if isinstance(value, ObjectId) else value
            for key, value in student_dict.items()
        }
        return student_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Separate test file
# def test_create_student():
#     import requests
#     print("Testing create_student")
#     url = "http://localhost:8000/student/"
#     data = {
#         "name": "John Doe",
#         "contribution": 0
#     }
#     try:
#         response = requests.post(url, json=data)
#         response.raise_for_status()  # Raise exception for error status codes
#         print(f"Status Code: {response.status_code}")
#         print(f"Response: {response.json()}")
#     except requests.exceptions.RequestException as e:
#         print(f"Error: {e}")


# test_create_student()


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
        result = app.state.whisper_model.transcribe(x)

        print(
            {
                "filename": filename,
                "transcription": result["text"],
                "language": result["language"],
                "processing_time": (
                    result["segments"][0]["seek"] if result["segments"] else 0
                ),
            }
        )

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
