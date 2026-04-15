import os
import pytesseract
from PIL import Image
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "SnapSense backend is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

UPLOAD_DIR = "uploads"

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join("uploads", file.filename)

    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    try:
        image = Image.open(file_path)
        extracted_text = pytesseract.image_to_string(image)
        cleaned_text = extracted_text.strip().replace("\n", " ")
    except Exception as e:
        extracted_text = f"Error extracting text: {str(e)}"

    return {
    "filename": file.filename,
    "saved_to": file_path,
    "size_bytes": len(content),
    "raw_text": extracted_text,
    "cleaned_text": cleaned_text,
    "message": "File processed successfully"
    }