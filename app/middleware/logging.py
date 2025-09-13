from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        logger.info(f"{request.method} {request.url}")
        body = await request.body()
        try:
            text = body.decode("utf-8")
            logger.debug(f"Body: {text}")
        except UnicodeDecodeError:
            logger.debug(f"Body: <binary data> ({len(body)} bytes)")
            response = await call_next(request)
            logger.info(f"Status: {response.status_code}")
            return response


def add_logging_middleware(app):
    app.add_middleware(LoggingMiddleware)
