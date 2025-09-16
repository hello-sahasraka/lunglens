from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        logger.info(f"{request.method} {request.url}")

        body = await request.body()

        # Check content type to decide how to log
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type or "text/" in content_type:
            try:
                logger.debug(f"Body: {body.decode('utf-8')}")
            except UnicodeDecodeError:
                logger.debug("Body: [Could not decode text]")
        elif "image/" in content_type or "multipart/form-data" in content_type:
            logger.debug(f"Body: [binary data: {len(body)} bytes]")
        else:
            logger.debug(f"Body: [unknown type, {len(body)} bytes]")

        response = await call_next(request)
        logger.info(f"Status: {response.status_code}")
        return response

def add_logging_middleware(app):
    app.add_middleware(LoggingMiddleware)
