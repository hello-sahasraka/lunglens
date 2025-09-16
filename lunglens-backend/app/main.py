from fastapi import FastAPI
import logging
from app.middleware.cors import add_cors_middleware
from app.middleware.logging import add_logging_middleware
from app.routes import routes_predict as predict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("lunglens")

app = FastAPI(title="LungLens")

add_cors_middleware(app)
add_logging_middleware(app)


@app.get("/")
def hello_world():
    return {"message": "Hello, World!"}


# Include API routers
app.include_router(predict.router)
