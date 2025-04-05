from fastapi import APIRouter, File, UploadFile

router = APIRouter()


@router.post("/recognize")
async def upload_and_transcribe(file: UploadFile = File(...), sectionName: str = Query(..., description="The name of the section")):
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


async def uploadToDB(text: string, sectionName: string):
    if not text:
        return False

    # Save the transcription to the database
    try:
        words = text.strip().split()
        firstName = words[0]
        newText = " ".join(words[1:])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        