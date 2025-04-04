from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# import internal modules
from server.lib.model_context import lifespan

# load environment variables from .env file
load_dotenv()

app = FastAPI(lifespan=lifespan)

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# import routes
from server.routes import classes, lectures, recognition

# include routes
app.include_router(classes.router, prefix="/classes", tags=["Classes"])
app.include_router(lectures.router, prefix="/lectures", tags=["Lectures"])
app.include_router(recognition.router, prefix="/recognition", tags=["Recognition"])

# run the app
app.add_event_handler("startup", lambda: print("Server is starting..."))
