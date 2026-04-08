from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "SnapSense backend is running"}

@app.get("/health")
def health():
    return {"status": "ok"}