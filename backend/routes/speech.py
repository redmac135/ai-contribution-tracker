from fastapi import APIRouter, File, UploadFile
from speech.recognition import Recognition


router = APIRouter()

@router.post("/convert")
async def convert(file: UploadFile = File(...)):
    try:
        text = Recognition.record(file.file, 10)
    except Exception as e:
        print(e)
    return 400, {"error": "Failed to convert audio to text."}