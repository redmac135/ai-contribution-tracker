# ai-contribution-tracker

## Schema for MongoDB

```json
{
    id: mongoid
    name: name of class
    students: [names of students]
    lectures: [ids]
}
```

```json
{
    id: mongoid
    date: date of lecture
    contrib: [
        {
            name: name of student
            said: what they said
            score: score
        }
    ]
}
```
