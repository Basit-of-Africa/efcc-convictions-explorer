"""
Developer platform persistence and billing helpers.

This module implements a lightweight SQLite-backed developer account system
for issuing paid API keys behind Paystack.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import secrets
import sqlite3
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any
from urllib import error, request


UTC = timezone.utc


def now_iso() -> str:
    return datetime.now(UTC).isoformat()


def parse_iso(value: str | None) -> datetime | None:
    if not value:
        return None
    return datetime.fromisoformat(value)


def hash_secret(secret: str, salt: str) -> str:
    return hashlib.pbkdf2_hmac(
        "sha256",
        secret.encode("utf-8"),
        salt.encode("utf-8"),
        120000,
    ).hex()


def create_password_hash(password: str) -> tuple[str, str]:
    salt = secrets.token_hex(16)
    return hash_secret(password, salt), salt


def verify_secret(secret: str, salt: str, expected_hash: str) -> bool:
    actual_hash = hash_secret(secret, salt)
    return hmac.compare_digest(actual_hash, expected_hash)


def generate_api_key() -> tuple[str, str]:
    raw_token = secrets.token_urlsafe(32)
    key = f"fchk_live_{raw_token}"
    return key[:12], key


@dataclass
class SessionUser:
    id: int
    email: str
    created_at: str


@dataclass
class ApiKeyRecord:
    id: int
    key_prefix: str
    status: str
    created_at: str
    last_used_at: str | None


class DeveloperPlatform:
    def __init__(self, db_path: str | None = None):
        default_path = Path(__file__).parent / "developer_platform.db"
        self.db_path = db_path or os.getenv("DEVELOPER_PLATFORM_DB", str(default_path))

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.db_path)
        connection.row_factory = sqlite3.Row
        return connection

    def initialize(self) -> None:
        with self._connect() as connection:
            connection.executescript(
                """
                CREATE TABLE IF NOT EXISTS developer_users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    password_salt TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS developer_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    token_hash TEXT NOT NULL,
                    expires_at TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES developer_users(id)
                );

                CREATE TABLE IF NOT EXISTS developer_subscriptions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    reference TEXT NOT NULL UNIQUE,
                    status TEXT NOT NULL,
                    amount_kobo INTEGER NOT NULL,
                    currency TEXT NOT NULL,
                    plan_name TEXT NOT NULL,
                    authorization_url TEXT,
                    access_code TEXT,
                    paid_at TEXT,
                    active_until TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES developer_users(id)
                );

                CREATE TABLE IF NOT EXISTS developer_api_keys (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    key_prefix TEXT NOT NULL,
                    key_hash TEXT NOT NULL,
                    key_salt TEXT NOT NULL,
                    status TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    last_used_at TEXT,
                    FOREIGN KEY (user_id) REFERENCES developer_users(id)
                );
                """
            )

    def create_user(self, email: str, password: str) -> SessionUser:
        normalized_email = email.strip().lower()
        password_hash, password_salt = create_password_hash(password)
        created_at = now_iso()

        with self._connect() as connection:
            cursor = connection.execute(
                """
                INSERT INTO developer_users (email, password_hash, password_salt, created_at)
                VALUES (?, ?, ?, ?)
                """,
                (normalized_email, password_hash, password_salt, created_at),
            )
            return SessionUser(
                id=cursor.lastrowid,
                email=normalized_email,
                created_at=created_at,
            )

    def authenticate_user(self, email: str, password: str) -> SessionUser | None:
        normalized_email = email.strip().lower()
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM developer_users WHERE email = ?",
                (normalized_email,),
            ).fetchone()

        if row is None:
            return None

        if not verify_secret(password, row["password_salt"], row["password_hash"]):
            return None

        return SessionUser(
            id=row["id"],
            email=row["email"],
            created_at=row["created_at"],
        )

    def create_session(self, user_id: int) -> str:
        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
        created_at = now_iso()
        expires_at = (datetime.now(UTC) + timedelta(days=30)).isoformat()

        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO developer_sessions (user_id, token_hash, expires_at, created_at)
                VALUES (?, ?, ?, ?)
                """,
                (user_id, token_hash, expires_at, created_at),
            )

        return raw_token

    def get_user_for_session(self, token: str) -> SessionUser | None:
        token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT u.*
                FROM developer_sessions s
                JOIN developer_users u ON u.id = s.user_id
                WHERE s.token_hash = ? AND s.expires_at > ?
                ORDER BY s.id DESC
                LIMIT 1
                """,
                (token_hash, now_iso()),
            ).fetchone()

        if row is None:
            return None

        return SessionUser(
            id=row["id"],
            email=row["email"],
            created_at=row["created_at"],
        )

    def create_payment_intent(self, user_id: int, amount_kobo: int, plan_name: str) -> dict[str, Any]:
        user = self.get_user_by_id(user_id)
        if user is None:
            raise ValueError("Developer user not found")

        paystack_secret = os.getenv("PAYSTACK_SECRET_KEY")
        if not paystack_secret:
            raise RuntimeError("PAYSTACK_SECRET_KEY is not configured")

        reference = f"fchk_{secrets.token_hex(12)}"
        callback_url = os.getenv("PAYSTACK_CALLBACK_URL", "http://localhost:3000/developers")
        payload = {
            "email": user.email,
            "amount": amount_kobo,
            "reference": reference,
            "callback_url": callback_url,
            "metadata": {
                "user_id": user.id,
                "plan_name": plan_name,
            },
        }

        data = json.dumps(payload).encode("utf-8")
        req = request.Request(
            "https://api.paystack.co/transaction/initialize",
            data=data,
            method="POST",
            headers={
                "Authorization": f"Bearer {paystack_secret}",
                "Content-Type": "application/json",
            },
        )

        try:
            with request.urlopen(req, timeout=20) as response:
                body = json.loads(response.read().decode("utf-8"))
        except error.HTTPError as exc:
            details = exc.read().decode("utf-8", errors="ignore")
            raise RuntimeError(f"Paystack initialize failed: {details}") from exc
        except error.URLError as exc:
            raise RuntimeError("Unable to reach Paystack") from exc

        if not body.get("status"):
            raise RuntimeError(body.get("message", "Unable to initialize Paystack payment"))

        payment_data = body["data"]
        created_at = now_iso()
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO developer_subscriptions (
                    user_id, reference, status, amount_kobo, currency, plan_name,
                    authorization_url, access_code, created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    user_id,
                    reference,
                    "pending",
                    amount_kobo,
                    "NGN",
                    plan_name,
                    payment_data.get("authorization_url"),
                    payment_data.get("access_code"),
                    created_at,
                    created_at,
                ),
            )

        return {
            "reference": reference,
            "authorization_url": payment_data.get("authorization_url"),
            "access_code": payment_data.get("access_code"),
            "amount_kobo": amount_kobo,
            "plan_name": plan_name,
        }

    def verify_webhook_signature(self, payload: bytes, signature: str | None) -> bool:
        secret = os.getenv("PAYSTACK_SECRET_KEY")
        if not secret or not signature:
            return False

        digest = hmac.new(secret.encode("utf-8"), payload, hashlib.sha512).hexdigest()
        return hmac.compare_digest(digest, signature)

    def apply_successful_payment(self, event: dict[str, Any]) -> dict[str, Any]:
        data = event.get("data") or {}
        reference = data.get("reference")
        if not reference:
            raise ValueError("Missing Paystack reference")

        with self._connect() as connection:
            subscription = connection.execute(
                "SELECT * FROM developer_subscriptions WHERE reference = ?",
                (reference,),
            ).fetchone()

            if subscription is None:
                raise ValueError("Unknown payment reference")

            paid_at = now_iso()
            active_until = (datetime.now(UTC) + timedelta(days=30)).isoformat()
            connection.execute(
                """
                UPDATE developer_subscriptions
                SET status = ?, paid_at = ?, active_until = ?, updated_at = ?
                WHERE reference = ?
                """,
                ("active", paid_at, active_until, paid_at, reference),
            )

            api_key = self.create_or_rotate_api_key(subscription["user_id"], connection)

        return {
            "reference": reference,
            "status": "active",
            "active_until": active_until,
            "api_key": api_key,
        }

    def create_or_rotate_api_key(
        self,
        user_id: int,
        connection: sqlite3.Connection | None = None,
    ) -> str:
        owns_connection = connection is None
        if connection is None:
            connection = self._connect()

        try:
            connection.execute(
                "UPDATE developer_api_keys SET status = 'revoked' WHERE user_id = ? AND status = 'active'",
                (user_id,),
            )
            key_prefix, raw_key = generate_api_key()
            salt = secrets.token_hex(16)
            key_hash = hash_secret(raw_key, salt)
            connection.execute(
                """
                INSERT INTO developer_api_keys (
                    user_id, key_prefix, key_hash, key_salt, status, created_at
                )
                VALUES (?, ?, ?, ?, 'active', ?)
                """,
                (user_id, key_prefix, key_hash, salt, now_iso()),
            )
            if owns_connection:
                connection.commit()
            return raw_key
        finally:
            if owns_connection:
                connection.close()

    def list_api_keys(self, user_id: int) -> list[ApiKeyRecord]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT id, key_prefix, status, created_at, last_used_at
                FROM developer_api_keys
                WHERE user_id = ?
                ORDER BY id DESC
                """,
                (user_id,),
            ).fetchall()

        return [
            ApiKeyRecord(
                id=row["id"],
                key_prefix=row["key_prefix"],
                status=row["status"],
                created_at=row["created_at"],
                last_used_at=row["last_used_at"],
            )
            for row in rows
        ]

    def has_active_subscription(self, user_id: int) -> bool:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT 1
                FROM developer_subscriptions
                WHERE user_id = ? AND status = 'active' AND active_until > ?
                ORDER BY id DESC
                LIMIT 1
                """,
                (user_id, now_iso()),
            ).fetchone()
        return row is not None

    def get_latest_subscription(self, user_id: int) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT reference, status, amount_kobo, currency, plan_name, active_until, paid_at, created_at
                FROM developer_subscriptions
                WHERE user_id = ?
                ORDER BY id DESC
                LIMIT 1
                """,
                (user_id,),
            ).fetchone()

        return dict(row) if row else None

    def authenticate_api_key(self, raw_key: str) -> SessionUser | None:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT k.id, k.key_hash, k.key_salt, u.id AS user_id, u.email, u.created_at
                FROM developer_api_keys k
                JOIN developer_users u ON u.id = k.user_id
                WHERE k.status = 'active'
                """
            ).fetchall()

            for row in rows:
                if verify_secret(raw_key, row["key_salt"], row["key_hash"]):
                    connection.execute(
                        "UPDATE developer_api_keys SET last_used_at = ? WHERE id = ?",
                        (now_iso(), row["id"]),
                    )
                    return SessionUser(
                        id=row["user_id"],
                        email=row["email"],
                        created_at=row["created_at"],
                    )

        return None

    def get_user_by_id(self, user_id: int) -> SessionUser | None:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT id, email, created_at FROM developer_users WHERE id = ?",
                (user_id,),
            ).fetchone()

        if row is None:
            return None

        return SessionUser(
            id=row["id"],
            email=row["email"],
            created_at=row["created_at"],
        )


def default_plan_amount_kobo() -> int:
    return int(os.getenv("DEVELOPER_API_PLAN_AMOUNT_KOBO", "500000"))


def default_plan_name() -> str:
    return os.getenv("DEVELOPER_API_PLAN_NAME", "Developer API Monthly")
