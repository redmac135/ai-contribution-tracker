from fastapi import APIRouter, HTTPException
from models.Lecture import Lecture

router = APIRouter()

@router.get("/list")
async def get_lectures():
    try:
        lectures = Lecture.objects().all()
        return {"lectures": [lecture.to_json() for lecture in lectures]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))