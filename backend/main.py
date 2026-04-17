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
    
    
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    try:
        image = Image.open(file_path)
        image = image.convert("L")
        image = image.point(lambda x: 0 if x < 150 else 255, "1")
        extracted_text = pytesseract.image_to_string(image, config="--psm 6")
        cleaned_text = extracted_text.strip().replace("\n", " ")
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