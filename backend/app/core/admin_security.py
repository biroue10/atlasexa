from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.admin import AdminUser


ALGORITHM = "HS256"

password_hash = PasswordHash.recommended()

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/admin/auth/login",
)


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return password_hash.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(
    *,
    admin_id: int,
    email: str,
    role: str,
) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.admin_access_token_expire_minutes,
    )

    payload = {
        "sub": str(admin_id),
        "email": email,
        "role": role,
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        settings.admin_jwt_secret,
        algorithm=ALGORITHM,
    )


def authenticate_admin(
    db: Session,
    email: str,
    password: str,
) -> AdminUser | None:
    admin = db.scalar(
        select(AdminUser).where(
            AdminUser.email == email.lower().strip(),
        ),
    )

    if admin is None:
        return None

    if not admin.is_active:
        return None

    if not verify_password(password, admin.password_hash):
        return None

    return admin


def get_current_admin(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> AdminUser:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.admin_jwt_secret,
            algorithms=[ALGORITHM],
        )

        subject = payload.get("sub")

        if subject is None:
            raise credentials_exception

        admin_id = int(subject)

    except (InvalidTokenError, ValueError):
        raise credentials_exception

    admin = db.get(AdminUser, admin_id)

    if admin is None or not admin.is_active:
        raise credentials_exception

    return admin
