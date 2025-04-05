import os
from mongoengine import connect
import certifi

uri = os.getenv("MONGODB_URI")
if uri is None:
    raise ValueError("MONGODB_URI environment variable is not set")

try:
    connect(
        db="StudentTracker",  # Name of your database
        host=uri,  # Your MongoDB Atlas URI
    )
    print("MongoDB connection successful")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    raise