import requests
import wave
import io
from fastapi import APIRouter, File, UploadFile, BaseModel
from speech.recognition import Recognition


router = APIRouter()


class AudioURL(BaseModel):
    audioUrl: str


@router.post("/convert")
async def convert(data: AudioURL):
    try:
        # get the audio url
        response = requests.get(data.audioURL)

        if not (response.status_code == 200):
            return 400, {"error": "Failed to download audio."}

        # convert the audio to text
        with wave.open(io.BytesIO(response.content), "rb") as wav_file:
            recognition = Recognition()
            result = recognition.record(wav_file, duration=10)
            return 200, {"result": result}
    except Exception as e:
        print(e)
        return 400, {"error": "Failed to convert audio to text."}

