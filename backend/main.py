from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router

app = FastAPI(
    title="Process First LLC API",
    description="API for chemical process flow visualization",
    version="1.0.0"
)
app.include_router(api_router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Process First LLC API",
        "documentation": "/docs",
        "endpoints": [
            # Task 3
            "/api/generate-report",
            "/api/download-report",
            # Task 4
            "/api/process-data",
            "/api/top-impact",
            "/api/scenarios",
            "/api/setpoint-impacts"
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)