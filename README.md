# SnapSense
SnapSense is an AI-powered screenshot organizer that automatically categorizes, extracts text, and enables search across your screenshots.
Instead of scrolling endlessly through your camera roll, SnapSense turns screenshots into structured, searchable data.

## Features
📤 Upload screenshots from a web interface
🧠 OCR (Optical Character Recognition) to extract text from images
🏷 Automatic categorization (receipt, shopping, travel, etc.)
🔍 Search screenshots by extracted text
🎯 Category-based filtering
🖼 Image preview gallery
💾 Persistent storage using Supabase (PostgreSQL)

## How it works
User uploads a screenshot
Backend saves the image
OCR extracts text from the image
Text is cleaned and categorized
Data is stored in a database
Frontend displays and allows search/filtering

## Tech Stack
Frontend

Next.js (App Router)
React
Tailwind CSS

Backend

FastAPI (Python)
Tesseract OCR
PIL (image preprocessing)

Database

Supabase (PostgreSQL)
