from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os

from . import auth, database, models

app = FastAPI()

allowed_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "*").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins or ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class JobCreate(BaseModel):
    company: str
    role: str
    status: str = "Applied"
    notes: str = ""


class JobUpdate(BaseModel):
    company: str
    role: str
    status: str
    notes: str


@app.post("/register")
def register(user: UserCreate, db: Session = Depends(database.get_db)):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
    )
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=400, detail="Username or email already exists")
    return {"msg": "User registered successfully"}


@app.post("/token")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db),
):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/jobs")
def get_jobs(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    jobs = (
        db.query(models.JobApplication)
        .filter(models.JobApplication.user_id == current_user.id)
        .all()
    )
    return [
        {
            "id": job.id,
            "company": job.company,
            "role": job.role,
            "status": job.status,
            "notes": job.notes,
        }
        for job in jobs
    ]


@app.post("/jobs")
def add_job(
    job: JobCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    db_job = models.JobApplication(
        company=job.company,
        role=job.role,
        status=job.status,
        notes=job.notes,
        user_id=current_user.id,
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return {
        "id": db_job.id,
        "company": db_job.company,
        "role": db_job.role,
        "status": db_job.status,
        "notes": db_job.notes,
    }


@app.put("/jobs/{job_id}")
def update_job(
    job_id: int,
    job_update: JobUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    db_job = (
        db.query(models.JobApplication)
        .filter(
            models.JobApplication.id == job_id,
            models.JobApplication.user_id == current_user.id,
        )
        .first()
    )
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")

    db_job.company = job_update.company
    db_job.role = job_update.role
    db_job.status = job_update.status
    db_job.notes = job_update.notes
    db.commit()
    db.refresh(db_job)

    return {
        "id": db_job.id,
        "company": db_job.company,
        "role": db_job.role,
        "status": db_job.status,
        "notes": db_job.notes,
    }


@app.delete("/jobs/{job_id}")
def delete_job(
    job_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    db_job = (
        db.query(models.JobApplication)
        .filter(
            models.JobApplication.id == job_id,
            models.JobApplication.user_id == current_user.id,
        )
        .first()
    )
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(db_job)
    db.commit()
    return {"msg": "Job deleted"}


@app.get("/dashboard")
def get_dashboard(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db),
):
    jobs = (
        db.query(models.JobApplication)
        .filter(models.JobApplication.user_id == current_user.id)
        .all()
    )
    return {
        "total_applications": len(jobs),
        "interviews": len([job for job in jobs if job.status == "Interview"]),
        "offers": len([job for job in jobs if job.status == "Offer"]),
    }
