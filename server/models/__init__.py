import os
from mongoengine import connect

# Load the MongoDB URI from an environment variable
uri = os.getenv("MONGODB_URI")
if uri is None:
    raise ValueError("MONGODB_URI environment variable is not set")

try:
    # Connect to MongoDB Atlas
    connect(
        db="StudentTracker",  # Name of your database
        host=uri,  # Your MongoDB Atlas URI
        alias="default",  # Use default alias for MongoEngine
    )
    print("MongoDB connection successful")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    raise
