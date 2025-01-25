from fastapi import FastAPI, include_router

app = FastAPI()

include_router(app, "routes.speech")