from fastapi import APIRouter
from models.Class import Class
from models.Lecture import Lecture
import random

router = APIRouter()


@router.get("/create-fake-data")
async def createFakeData(lecture_num: int = 1):
    """
    Create fake data for testing purposes.
    """
    # Create a class
    class_obj = Class(
        name=f"Lecture {lecture_num}", students=["Zanan", "Felix", "Philipp", "Ethan"]
    )
    class_obj.save()

    # Create 5 different lectures each with ~5 contributions
    for i in range(5):
        lecture_obj = Lecture(
            class_name=class_obj.name,
            date=f"2023-10-{i + 1}",
            contrib=[
                {
                    "name": f"Student {j}",
                    "said": f"Random Contribution {j}",
                    "score": random.randint(1, 10),
                }
                for j in range(5)
            ],
        )
        lecture_obj.save()
        class_obj.lectures.append(lecture_obj.id)

    class_obj.save()

    return {"message": "Fake data created successfully!"}
