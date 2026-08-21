# Voice Command Shopping Assistant

A voice-based shopping list manager with smart suggestions. Built as a technical assessment project.

## Features

- **Voice Input:** Use your microphone to add, remove, and search for items (e.g., "Add 2 bottles of milk", "Remove bread").
- **NLP Processing:** Understands varied phrases and extracts intents, quantities, and items.
- **Smart Suggestions:** Recommends items based on your shopping history and the current season.
- **Minimalist UI:** Clean, responsive, and mobile-friendly interface built with Next.js and Tailwind CSS.
- **Real-time Feedback:** Visual confirmation of commands and loading states.

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide React
- **Backend:** FastAPI, Python, SQLAlchemy, SQLite
- **Voice API:** Native Web Speech API

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.9+)

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Seed the database with initial products:
   ```bash
   python app/seed.py
   ```
5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will be running at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:3000`.

## Architecture

The project is structured as a monorepo containing both the frontend and backend.
- `backend/app/routes/`: Contains API endpoints for voice parsing, shopping list CRUD, search, and recommendations.
- `backend/app/services/`: Contains the NLP service for intent and entity extraction.
- `frontend/src/components/`: Reusable UI components for the microphone button, shopping list, and suggestions.
- `data/`: Contains JSON files used to seed the database with products, categories, and seasonal information.
