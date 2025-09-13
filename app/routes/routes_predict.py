from fastapi import APIRouter
from fastapi import File, UploadFile
from app.services.predict_services import predict_uploaded_image
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

router = APIRouter(
    prefix="/predict",
    tags=["predict"],
)


@router.post("/")
async def predict(file: UploadFile = File(...)):
    logger.info("Request recieved")
    logger.info(f"Recieved the image: {file.filename}")
    return await predict_uploaded_image(file)
