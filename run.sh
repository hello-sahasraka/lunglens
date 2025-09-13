#!/usr/bin/env bash
export PORT=8000
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000


