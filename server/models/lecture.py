from mongoengine import (
    Document,
    StringField,
    ListField,
    EmbeddedDocument,
    EmbeddedDocumentField,
    IntField,
    DateField,
    ObjectIdField,
)


class Contribution(EmbeddedDocument):
    name = StringField(required=True)  # Name of the student
    said = StringField(required=True)  # What the student said
    score = IntField(required=True)  # Score


class Lecture(Document):
    date = DateField(required=True)  # Date of the lecture
    contrib = ListField(
        EmbeddedDocumentField(Contribution), required=True
    )  # List of contributions

    meta = {
        "collection": "lectures",  # MongoDB collection name
        "ordering": ["-date"],  # Default ordering by date (descending)
        "auto_create_index": True,
    }
