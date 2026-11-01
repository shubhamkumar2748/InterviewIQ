# InterviewIQ

InterviewIQ is a full-stack AI mock interview platform designed for technical and behavioral interview preparation. The app lets users:

- choose a role and interview track
- configure interview questions and topics
- answer live AI-generated questions
- receive scoring and feedback instantly
- review performance analytics and recommendations

## Tech stack

- Frontend: React + Vite + Tailwind CSS
- Backend: FastAPI + Python
- API simulation: local mock service compatible with frontend proxy routes

## Local setup

1. Start the backend:
   - `cd Backend && python main.py`
2. Start the frontend:
   - `cd Frontend && npm install && npm run dev -- --host 0.0.0.0`
3. Open the app:
   - http://localhost:5173/

## One-command runs

- Linux/macOS: `./start.sh`
- Windows: `start.bat`

## GitHub Pages deployment

The frontend is deployed to GitHub Pages from the `main` branch by the
`.github/workflows/deploy-pages.yml` workflow. After pushing changes, enable
GitHub Pages in the repository settings and select **GitHub Actions** as the
build and deployment source.

GitHub Pages hosts only the frontend. Features that call the FastAPI backend
require a separately deployed backend and a configured API URL.

## Project structure

- `Backend/` — API server
- `Frontend/` — React app
- `README.md` — project overview

## Notes

This project is structured as a hackathon-ready MVP and is designed to run locally without requiring cloud credentials for demo use.
