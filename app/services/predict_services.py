from fastapi import File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import logging
import os
import numpy as np
import cv2
import tensorflow as tf
from starlette.concurrency import run_in_threadpool 


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
IMAGE_SIZE = (128, 128)
CLASS_NAMES = ['adenocarcinoma', 'large.cell.carcinoma', 'normal', 'squamous.cell.carcinoma']


try:
    cancer_prediction_model = tf.keras.models.load_model(
        os.path.join(BASE_DIR, "models", "Chest_cancer_detection_model.keras")
    )
    logger.info("Cancer prediction model loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    raise RuntimeError(f"Failed to load model: {e}")


async def predict_uploaded_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        logger.warning(f"Invalid file type: {file.content_type}")
        return JSONResponse(status_code=400, content={"error": "File must be an image"})

    logger.info(f"[predict_uploaded_image] Received file: {file.filename}")

    try:
        image_bytes = await file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("Failed to decode image")
        logger.info(f"[predict_uploaded_image] Decoded image: {file.filename}")


        resized_image = cv2.resize(image, IMAGE_SIZE)
        scaled_image = resized_image / 255.0
        input_image = np.expand_dims(scaled_image, axis=0)


        predictions = await run_in_threadpool(cancer_prediction_model.predict, input_image)
        predicted_index = int(np.argmax(predictions))
        predicted_class = CLASS_NAMES[predicted_index]
        confidence = float(predictions[0][predicted_index])

        logger.info(f"[predict_uploaded_image] Prediction: {predicted_class} ({confidence:.2f})")

        return {
            "predicted_class": predicted_class,
            "confidence": confidence,
            "all_probabilities": predictions[0].tolist()
        }

    except Exception as e:
        logger.error(f"[predict_uploaded_image] Error processing file {file.filename}: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {e}")
