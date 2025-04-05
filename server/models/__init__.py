import os
from mongoengine import connect
import certifi

uri = os.getenv("MONGODB_URI")
if uri is None:
    raise ValueError("MONGODB_URI environment variable is not set")

try:
    connect(
        db="StudentTracker",
        host=uri,
        ssl=True,
        tls=True,
        tlsAllowInvalidCertificates=True,
        tlsCAFile=certifi.where(),
        authentication_source='admin',
        retryWrites=True,
        serverSelectionTimeoutMS=5000
    )
    print("MongoDB connection successful")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    raise