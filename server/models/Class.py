from mongoengine import Document, StringField, ListField, ReferenceField, ObjectIdField


class Class(Document):
    name = StringField(required=True)
    students = ListField(StringField(), required=True)  # List of student names
    lectures = ListField(ObjectIdField())  # List of lecture IDs (MongoDB ObjectIds)

    meta = {
        "collection": "classes",  # MongoDB collection name
        "ordering": ["name"],  # Default ordering by name
        "auto_create_index": True,
    }


Class.create_index([("name", 1)], unique=True)
