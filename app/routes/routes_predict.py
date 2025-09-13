from fastapi import APIRouter
from fastapi import File, UploadFile
from app.services.predict_services import predict_uploaded_image

router = APIRouter(
    prefix="/predict",
    tags=["predict"],
)

@router.post("/")
async def predict(file: UploadFile = File(...)):
    return await predict_uploaded_image(file)