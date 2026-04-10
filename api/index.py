import sys
import os
import traceback

# Ensure the current directory is in sys.path for absolute imports
sys.path.append(os.path.dirname(__file__))

try:
    from app.data_loader import load_data, parse_manual_data
    from app.preprocessing import clean_data
    from app.model import train_lasso_model
    from app.export import export_results
except ImportError as e:
    print(f"Import Error: {str(e)}")
    print(traceback.format_exc())
    # Fallback for different execution environments
    try:
        from .app.data_loader import load_data, parse_manual_data
        from .app.preprocessing import clean_data
        from .app.model import train_lasso_model
        from .app.export import export_results
    except Exception as e2:
        print(f"Secondary Import Error: {str(e2)}")

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

app = FastAPI(title="Lasso Regression API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ManualDataInput(BaseModel):
    data: list[dict]
    target_column: str
    alpha: float = 1.0

class ExportRequest(BaseModel):
    results: dict
    format: str

@app.post("/api/train/upload")
async def train_with_upload(
    file: UploadFile = File(...),
    target_column: str = Form(...),
    alpha: float = Form(1.0)
):
    try:
        content = await file.read()
        df = load_data(content, file.filename)
        cleaned_df = clean_data(df)
        results = train_lasso_model(cleaned_df, target_column, alpha)
        return {"status": "success", "results": results}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/train/manual")
async def train_with_manual(payload: ManualDataInput):
    try:
        df = parse_manual_data(payload.data)
        cleaned_df = clean_data(df)
        results = train_lasso_model(cleaned_df, payload.target_column, payload.alpha)
        return {"status": "success", "results": results}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/export")
async def export_data(payload: ExportRequest):
    try:
        export_data = export_results(payload.results, payload.format.lower())
        return {"status": "success", "export": export_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
