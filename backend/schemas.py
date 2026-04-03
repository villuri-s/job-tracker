from pydantic import BaseModel
from typing import Optional

class JobCreate(BaseModel):
    company: str
    role: str
    status: str = "Applied"
    notes: str = ""

class JobResponse(BaseModel):
    id: int
    company: str
    role: str
    status: str
    notes: str

    class Config:
        from_attributes = True

class JobUpdate(BaseModel):
    status: str
    notes: str

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None