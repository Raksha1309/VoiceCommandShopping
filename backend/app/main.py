from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import voice, shopping, search, recommendations

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Voice Command Shopping Assistant")

# CORS setup for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
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
