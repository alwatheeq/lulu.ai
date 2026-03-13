from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from app.services.claude_service import analyze_food_image, chat_with_lulu
from app.core.config import settings
from pydantic import BaseModel


from app.api import login, users, meals, water, admin, clients

class ChatRequest(BaseModel):
    message: str

app = FastAPI(title=settings.PROJECT_NAME)
app.include_router(login.router, prefix="/api", tags=["login"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(meals.router, prefix="/api/meals", tags=["meals"])
app.include_router(water.router, prefix="/api/water", tags=["water"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(clients.router, prefix="/api/clients", tags=["clients"])

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for Vercel deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# The root health endpoints remain at the top level
@app.get("/health")
def health_check():
    return {"status": "healthy", "ai_engine": "Claude 3.5 Sonnet"}

# Serve static files from the frontend/dist directory
# When building for production, the React files will be put into a 'static' folder
frontend_dist_path = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")

if os.path.exists(frontend_dist_path):
    app.mount("/", StaticFiles(directory=frontend_dist_path, html=True), name="frontend")
    
    @app.exception_handler(404)
    async def not_found_exception_handler(request, exc):
        return FileResponse(os.path.join(frontend_dist_path, "index.html"))
else:
    # If dist doesn't exist (dev mode), redirect root to health
    @app.get("/")
    def read_root():
        return {"message": "Welcome to Lulu.ai Backend (Dev Mode) - Frontend 'dist' folder not found"}
