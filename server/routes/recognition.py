from fastapi import APIRouter, File, UploadFile

router = APIRouter()


@router.post("/recognize/")
async def upload_and_transcribe(file: UploadFile = File(...)): ...
