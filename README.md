# SnapSense
SnapSense is an AI-powered screenshot organizer that automatically categorizes, extracts text, and enables search across your screenshots.
Instead of scrolling endlessly through your camera roll, SnapSense turns screenshots into structured, searchable data.

## Features
- 📤 Upload screenshots from a web interface.
- 🧠 OCR (Optical Character Recognition) to extract text from images.
- 🏷 Automatic categorization (receipt, shopping, travel, etc.).
- 🔍 Search screenshots by extracted text.
- 🎯 Category-based filtering.
- 🖼 Image preview gallery.
- 💾 Persistent storage using Supabase (PostgreSQL).

## How it works
1. User uploads a screenshot.
2. Backend saves the image.
3. OCR extracts text from the image.
4. Text is cleaned and categorized.
5. Data is stored in a database.
6. Frontend displays and allows search/filtering.

## Tech Stack

- Frontend:
    ```bash
    Next.js (App Router)
    React
    Tailwind CSS
    ```
- Backend:
    ```bash
   FastAPI (Python)
   Tesseract OCR
   PIL (image preprocessing)
    ```
- Database:
  ```bash
  Supabase (PostgreSQL)
    ```

### Setup instructions:
git clone https://github.com/your-username/snapsense.git
cd snapsense
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload
run frontend:
cd frontend
npm install
npm run dev
