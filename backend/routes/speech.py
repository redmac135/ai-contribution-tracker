import wave
from fastapi import APIRouter, File, UploadFile, BaseModel
from speech.recognition import Recognition


router = APIRouter()

class Audio(BaseModel):
    audio: bytes

@router.post("/convert")
async def convert(file: UploadFile = File(...)):
    try:
        content = file.file.read()
        with open(file.filename, "wb") as f:
            f.write(content)
        result = Recognition().record(content, 10)
        return {"response": result}
    except Exception as e:
        print(e)
        return 400, {"error": "Failed to convert audio to text."}