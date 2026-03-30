import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Get API URL from environment, fallback to localhost for development
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
ALLOWED_ORIGINS = [
    FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:5173",  # Vite dev server
]

# Add production URLs when deployed
if os.getenv("ENVIRONMENT") == "production":
    ALLOWED_ORIGINS.extend([
        "https://your-vercel-domain.vercel.app",
        # Add your custom domain here
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... rest of your FastAPI code
