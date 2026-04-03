# Job Search Command Center

A portfolio-ready full-stack job application tracker that helps you manage job applications, update pipeline status, and visualize hiring progress with a polished analytics dashboard.

## Live Demo

- Frontend: [https://job-tracker-nu-peach.vercel.app](https://job-tracker-nu-peach.vercel.app)
- Backend API: [https://job-tracker-backend-pfh8.onrender.com](https://job-tracker-backend-pfh8.onrender.com)
- API Docs: [https://job-tracker-backend-pfh8.onrender.com/docs](https://job-tracker-backend-pfh8.onrender.com/docs)

## Features

- User registration and login with JWT authentication
- Add, edit, and delete job applications
- Update company, role, notes, and application status
- Status filters for Applied, Interview, Offer, and Rejected
- Search by company name
- Sort applications by date or status
- Dashboard summary cards for total applications, interviews, and offers
- Pie chart for status distribution
- Bar chart for applications per company
- Logged-in username display and logout confirmation
- Loading states, empty state, and success/error feedback
- Responsive, portfolio-focused UI

## Tech Stack

- React
- FastAPI
- SQLite
- Material UI
- Recharts
- SQLAlchemy
- JWT Authentication

## Screenshots

### Dashboard

![Dashboard Screenshot](frontend/docs/screenshots/dashboard.svg)

### Login

![Login Screenshot](frontend/docs/screenshots/login.svg)

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/villuri-s/job-tracker.git
cd job-tracker
```

### 2. Run the backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend will run at:

```bash
http://localhost:8000
```

API docs:

```bash
http://localhost:8000/docs
```

### 3. Run the frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

Start the frontend:

```bash
npm start
```

Frontend will run at:

```bash
http://localhost:3000
```

## Deployment

- Frontend deployed on Vercel
- Backend deployed on Render
- Production API base URL is configured with `REACT_APP_API_BASE_URL`
- Backend CORS allows frontend requests

## Project Structure

```text
job-tracker/
  backend/
    auth.py
    database.py
    main.py
    models.py
    requirements.txt
  frontend/
    src/
    public/
    docs/screenshots/
    package.json
  render.yaml
  README.md
```

## Note

Render free instances may sleep after inactivity, so the first API request can take some time to respond.
