from fastapi import APIRouter

router = APIRouter()

@router.get("/convert-speech")
def convert_speech():
    return {"Hello": "World"}