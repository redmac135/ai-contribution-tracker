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

    # Initialize a dictionary to store student scores
    student_scores = {student: {} for student in class_object.students}

    # Process each lecture
    for lecture in lectures:
        # Count the frequency of contributions for each student in the lecture
        contribution_counts = {}
        for contribution in lecture.contrib:
            contribution_counts[contribution.name] = (
                contribution_counts.get(contribution.name, 0) + 1
            )

        # Determine the top 3 most frequent speakers
        sorted_contributions = sorted(
            contribution_counts.items(), key=lambda x: x[1], reverse=True
        )
        top_speakers = sorted_contributions[:3]
        top_speaker_names = {speaker[0] for speaker in top_speakers}

        # Get the maximum and minimum contribution counts
        max_count = sorted_contributions[0][1] if sorted_contributions else 0
        min_count = sorted_contributions[-1][1] if sorted_contributions else 0

        # Assign scores for the lecture
        for student in class_object.students:
            if student in contribution_counts:
                count = contribution_counts[student]
                # Base score: 7 points for at least one mention
                score = 7
                if student in top_speaker_names:
                    # Top 3 speakers get 10 points
                    score = 10
                elif max_count > min_count:
                    # Distribute scores between 7 and 10 for others
                    score += (count - min_count) / (max_count - min_count) * (10 - 7)
                student_scores[student][lecture.date] = round(score, 2)
            else:
                # No contributions for this lecture
                student_scores[student][lecture.date] = 3

    return {
        "class": class_object.name,
        "students": student_scores,
    }