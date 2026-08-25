from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import voice, shopping, search, recommendations

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables on startup
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(title="Voice Command Shopping Assistant", lifespan=lifespan)

# CORS setup for frontend
origins = [
    "http://localhost:3000",
    "https://voicecommandshopping.vercel.app",
    "https://voice-command-shopping-3knwgs38m-raksha-s-projects-95ea380f.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(voice.router, prefix="/api/voice", tags=["voice"])
app.include_router(shopping.router, prefix="/api/shopping", tags=["shopping"])
app.include_router(search.router, prefix="/api/search", tags=["search"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["recommendations"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Voice Command Shopping Assistant API"}
