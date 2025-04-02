from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise Exception("MONGO_URI is not set in the .env file")

client = MongoClient(MONGO_URI)
db = client.get_database("ai-contribution-tracker")
classes_collection = db["classes"]

# FastAPI router
router = APIRouter()

# Get all classes
@router.get("/classes/")
async def get_classes():
    try:
        classes = list(classes_collection.find())
        for cls in classes:
            cls["_id"] = str(cls["_id"])  # Convert ObjectId to string for JSON serialization
        return {"classes": classes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Create a new class
@router.post("/classes/")
async def create_class(class_data: dict):
    try:
        result = classes_collection.insert_one(class_data)
        return {"id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))