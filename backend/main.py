import os
import pytesseract
from PIL import Image, ImageOps
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from supabase import create_client, Client

SUPABASE_URL = "https://bkeajqtbpkvnmiapwqkh.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrZWFqcXRicGt2bm1pYXB3cWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MTQ2MzYsImV4cCI6MjA5Mjk5MDYzNn0.nk-I1ejiecH7VmQh1gcJsMVmQttXkuQW4nLXrFXxAkU"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

app = FastAPI()
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

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
screenshots = []

def categorize(text):
    text = text.lower()

    receipt_keywords = ["total", "cash", "change", "receipt", "tax", "subtotal"]
    shopping_keywords = ["amazon", "add to cart", "buy now", "order", "price", "delivery", "in stock"]
    travel_keywords = ["flight", "boarding", "gate", "departure", "arrival"]

    if any(word in text for word in shopping_keywords):
        return "shopping"
    elif any(word in text for word in receipt_keywords):
        return "receipt"
    elif any(word in text for word in travel_keywords):
        return "travel"
    else:
        return "other"
    

def extract_text_from_image(file_path):
    image = Image.open(file_path)

    gray = image.convert("L")
    text_general = pytesseract.image_to_string(gray, config="--psm 6")

    enlarged = gray.resize((gray.width * 2, gray.height * 2))
    high_contrast = ImageOps.autocontrast(enlarged)
    thresholded = high_contrast.point(lambda x: 0 if x < 170 else 255, "1")
    text_receipt = pytesseract.image_to_string(thresholded, config="--psm 4")

    if len(text_receipt.strip()) > len(text_general.strip()):
        return text_receipt
    return text_general

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    try:
        extracted_text = extract_text_from_image(file_path)
        lines = [line.strip() for line in extracted_text.splitlines() if line.strip()]
        cleaned_text = " | ".join(lines)
    except Exception as e:
        extracted_text = f"Error extracting text: {str(e)}"
        cleaned_text = ""

    category = categorize(cleaned_text)

    screenshot_data = {
        "filename": file.filename,
        "saved_to": file_path,
        "size_bytes": len(content),
        "raw_text": extracted_text,
        "cleaned_text": cleaned_text,
        "category": category,
    }

    screenshots.append(screenshot_data)

    return {
        **screenshot_data,
        "message": "File processed successfully"
    }

@app.get("/screenshots")
def get_screenshots():
    return screenshots