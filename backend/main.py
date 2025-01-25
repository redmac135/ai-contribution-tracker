from fastapi import FastAPI
from routes.speech import router

app = FastAPI()

app.include_router(router, prefix="/speech")