import json
from fastapi import APIRouter, Form
from fastapi import File, UploadFile
from app.services.predict_services import predict_uploaded_image
from app.services.generate_pdf_services import generate_pdf_report
from app.utils.image_utils import save_image

router = APIRouter(
    prefix="/predict",
    tags=["predict"],
)


@router.post("/")
async def predict(file: UploadFile = File(...)):
    return await predict_uploaded_image(file)


@router.post("/pdf")
async def pdf_generate(
    predicted_class: str = Form(...),
    confidence: str = Form(...),
    predictions: str = Form(...),
    ct_scan: UploadFile = File(...),
):
    print("Predictions:", predictions)
    ct_image_path = await save_image(ct_scan)
    predictions_list = json.loads(predictions)
    print("Predictions list:", predictions_list)
    return generate_pdf_report(
        predicted_class, confidence, predictions_list, ct_image_path
    )
