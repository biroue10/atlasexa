from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.admin_security import (
    authenticate_admin,
    create_access_token,
    get_current_admin,
)
from app.db.session import get_db
from app.models.admin import AdminUser
from app.schemas.admin import (
    AdminLoginRequest,
    AdminTokenResponse,
    AdminUserResponse,
)

router = APIRouter(
    prefix="/api/admin/auth",
    tags=["admin-auth"],
)


@router.post(
    "/login",
    response_model=AdminTokenResponse,
)
def login(
    payload: AdminLoginRequest,
    db: Annotated[Session, Depends(get_db)],
) -> AdminTokenResponse:
    admin = authenticate_admin(
        db,
        payload.email,
        payload.password,
    )

    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_access_token(
        admin_id=admin.id,
        email=admin.email,
        role=admin.role,
    )

    return AdminTokenResponse(
        access_token=token,
    )


@router.get(
    "/me",
    response_model=AdminUserResponse,
)
def current_admin(
    admin: Annotated[
        AdminUser,
        Depends(get_current_admin),
    ],
) -> AdminUser:
    return admin
