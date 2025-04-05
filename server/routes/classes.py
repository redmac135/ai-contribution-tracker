from fastapi import APIRouter
from models.Class import Class

router = APIRouter()

@router.get("/info/")
def classes(className: str):
    classthing = Class.objects(name=className).first()
    print(classthing)

    return {
        "message": "Hello from the classes route!"
    }