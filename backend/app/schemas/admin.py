from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    name: str
    role: str
    is_active: bool
    created_at: datetime
