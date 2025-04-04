from fastapi import FastAPI
import whisper
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # load whisper model
    app.state.whisper_model = whisper.load_model("base")

    # yield control to the app
    yield

    # cleanup when the app shuts down
    del app.state.whisper_model
