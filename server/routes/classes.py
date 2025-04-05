from fastapi import APIRouter
from models.Class import Class
from models.Lecture import Lecture  # Ensure Lecture is imported

router = APIRouter()

@router.get("/info/")
def classes(className: str):
    # Fetch all lectures for the specified class
    lectures = Lecture.objects(class_name=className)
    class_object = Class.objects(name=className).first()
    if not class_object:
        return {"error": "Class not found"}
    if not lectures:
        return {"error": "No lectures found for this class"}
    
    
    

    return {
        # class name
        # a dictionary (keys to be students, values to be pairs of values (date, score))
        #

        "class": class_object.name,
        "students": class_object.students,
        "lectures": [
            {
                "date": lecture.date,
                "contributions": [
                    {
                        "name": contribution.name,
                        "said": contribution.said,
                        "score": contribution.score,
                    }
                    for contribution in lecture.contrib
                ],
            }
            for lecture in lectures
        ],
    
    }