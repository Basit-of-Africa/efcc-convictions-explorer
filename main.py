"""
FastAPI application for EFCC Convictions Explorer.

A REST API for searching and analyzing EFCC conviction records.
"""

import os
import json
from difflib import SequenceMatcher
from pathlib import Path
from contextlib import asynccontextmanager
import pandas as pd
from fastapi import FastAPI, HTTPException, Query, Depends, Header, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from models import (
    ConvictionRecord,
    DeveloperApiKeyIssueResponse,
    DeveloperApiKeysResponse,
    DeveloperApiKeySummary,
    DeveloperAuthResponse,
    DeveloperBillingInitializeRequest,
    DeveloperBillingInitializeResponse,
    DeveloperLoginRequest,
    DeveloperProfileResponse,
    DeveloperSignupRequest,
    PaginatedResponse,
    ScreeningMatchRecord,
    ScreeningQuery,
    ScreeningReportListItem,
    ScreeningReportListResponse,
    ScreeningReportResponse,
    ScreeningRequest,
    ScreeningSummary,
    StatsResponse,
    HealthResponse,
)
from data_cleaning import process_efcc_data
from developer_platform import (
    DeveloperPlatform,
    default_plan_amount_kobo,
    default_plan_name,
)


# Global dataset (loaded at startup)
convictions_data: list[dict] = []
developer_platform = DeveloperPlatform()


def load_conviction_data():
    """Load and process conviction data."""
    global convictions_data
    
    # Try to load from CSV file - check multiple locations
    possible_paths = [
        Path("efcc_convictions_updated.csv"),
        Path("efcc_convictions.csv"),
        Path(__file__).parent / "efcc_convictions_updated.csv",
        Path(__file__).parent / "efcc_convictions.csv",
        Path.cwd() / "efcc_convictions_updated.csv",
        Path.cwd() / "efcc_convictions.csv",
    ]
    
    csv_file = None
    for path in possible_paths:
        if path.exists():
            csv_file = path
            break
    
    if csv_file:
        try:
            df = pd.read_csv(csv_file, engine='python')
            raw_data = df.to_dict(orient="records")
            convictions_data = process_efcc_data(raw_data)
            print(f"[LOAD] SUCCESS: Loaded {len(convictions_data)} conviction records from {csv_file}")
        except Exception as e:
            print(f"[LOAD] ERROR: {e}")
            convictions_data = []
    else:
        print(f"[LOAD] WARNING: CSV file not found")
        print("  Checked:")
        for path in possible_paths:
            print(f"    - {path.absolute()}")
        convictions_data = []


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application lifecycle events."""
    # Load data on startup
    developer_platform.initialize()
    load_conviction_data()
    yield
    # Cleanup on shutdown (if needed)
    pass


# Initialize FastAPI app with lifespan
app = FastAPI(
    title="EFCC Convictions Explorer",
    description="REST API for searching and analyzing EFCC conviction records",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS to allow frontend requests
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://0.0.0.0:3000",
    "http://0.0.0.0:3001",
    "http://localhost:5173",  # Vite dev server
]

# Allow temporary tunnel frontends during development.
# This keeps local development simple while still using an explicit list for
# common localhost origins.
allowed_origin_regex = r"https://.*\.(trycloudflare\.com|opentunnel\.dev)$"

# Add production origins from environment variable
if os.getenv("ENVIRONMENT") == "production":
    vercel_url = os.getenv("VERCEL_URL")
    if vercel_url:
        allowed_origins.append(f"https://{vercel_url}")
    
    # Add custom production domain
    custom_domain = os.getenv("CUSTOM_DOMAIN")
    if custom_domain:
        allowed_origins.append(f"https://{custom_domain}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=allowed_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_dashboard_user(authorization: str = Header(default="")):
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing developer session token",
        )

    token = authorization.replace("Bearer ", "", 1).strip()
    user = developer_platform.get_user_for_session(token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired developer session token",
        )

    return user


def get_paid_api_user(
    x_api_key: str = Header(default="", alias="X-API-Key"),
    authorization: str = Header(default=""),
):
    raw_key = x_api_key.strip()

    if not raw_key and authorization.startswith("Bearer "):
        raw_key = authorization.replace("Bearer ", "", 1).strip()

    if not raw_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing API key",
        )

    user = developer_platform.authenticate_api_key(raw_key)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
        )

    if not developer_platform.has_active_subscription(user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Developer subscription is inactive",
        )

    return user


def build_paginated_response(records: list[dict], limit: int, offset: int) -> PaginatedResponse:
    if not records:
        return PaginatedResponse(total=0, limit=limit, offset=offset, data=[])

    paginated = records[offset:offset + limit]
    return PaginatedResponse(
        total=len(records),
        limit=limit,
        offset=offset,
        data=[ConvictionRecord(**record) for record in paginated],
    )


def normalize_screening_value(value: str | None) -> str:
    return " ".join((value or "").strip().upper().split())


def score_name_match(candidate_name: str, query_name: str) -> tuple[str, float]:
    normalized_candidate = normalize_screening_value(candidate_name)
    normalized_query = normalize_screening_value(query_name)

    if not normalized_candidate or not normalized_query:
        return "weak", 0.0

    if normalized_candidate == normalized_query:
        return "exact", 1.0

    if normalized_query in normalized_candidate or normalized_candidate in normalized_query:
        return "possible", 0.9

    ratio = SequenceMatcher(None, normalized_candidate, normalized_query).ratio()
    if ratio >= 0.85:
        return "possible", round(ratio, 2)
    if ratio >= 0.7:
        return "weak", round(ratio, 2)

    return "weak", round(ratio, 2)


def build_screening_report(
    *,
    query_name: str,
    aliases: list[str],
    location: str | None,
    limit: int,
) -> dict:
    search_terms = [query_name, *aliases]
    ranked_matches: list[dict] = []

    for record in convictions_data:
        best_match_type = "weak"
        best_confidence = 0.0

        for term in search_terms:
            match_type, confidence = score_name_match(record.get("name", ""), term)
            if confidence > best_confidence:
                best_match_type = match_type
                best_confidence = confidence

        if best_confidence < 0.7:
            continue

        if location:
            normalized_location = normalize_screening_value(location)
            normalized_court = normalize_screening_value(record.get("court", ""))
            if normalized_location and normalized_location not in normalized_court:
                best_confidence = round(max(0.7, best_confidence - 0.08), 2)
                if best_confidence < 0.75 and best_match_type == "possible":
                    best_match_type = "weak"

        ranked_matches.append(
            {
                "match_type": best_match_type,
                "confidence": round(best_confidence, 2),
                "record": record,
            }
        )

    ranked_matches.sort(
        key=lambda item: (
            0 if item["match_type"] == "exact" else 1,
            -item["confidence"],
            item["record"].get("name", ""),
        )
    )
    ranked_matches = ranked_matches[:limit]

    exact_matches = sum(1 for item in ranked_matches if item["match_type"] == "exact")
    possible_matches = sum(1 for item in ranked_matches if item["match_type"] == "possible")
    highest_confidence = max((item["confidence"] for item in ranked_matches), default=0.0)

    if exact_matches > 0 or highest_confidence >= 0.95:
        status_value = "match"
    elif ranked_matches:
        status_value = "review"
    else:
        status_value = "clear"

    return {
        "status": status_value,
        "confidence": round(highest_confidence, 2),
        "summary": {
            "exact_matches": exact_matches,
            "possible_matches": possible_matches,
            "total_matches": len(ranked_matches),
        },
        "matches": ranked_matches,
    }

# ============================================================================
# ENDPOINTS
# ============================================================================

@app.get(
    "/",
    response_model=HealthResponse,
    summary="Health Check",
    tags=["Health"]
)
async def health_check():
    """
    Health check endpoint.
    
    Returns:
        Status of the API and loaded record count
    """
    return HealthResponse(
        status="operational",
        message=f"EFCC Convictions Explorer is running. Loaded {len(convictions_data)} records."
    )


@app.post(
    "/developer/auth/signup",
    response_model=DeveloperAuthResponse,
    summary="Create developer account",
    tags=["Developer Auth"],
)
async def developer_signup(payload: DeveloperSignupRequest):
    try:
        user = developer_platform.create_user(payload.email, payload.password)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Developer account already exists") from exc

    token = developer_platform.create_session(user.id)
    return DeveloperAuthResponse(access_token=token, email=user.email)


@app.post(
    "/developer/auth/login",
    response_model=DeveloperAuthResponse,
    summary="Login developer account",
    tags=["Developer Auth"],
)
async def developer_login(payload: DeveloperLoginRequest):
    user = developer_platform.authenticate_user(payload.email, payload.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid developer credentials")

    token = developer_platform.create_session(user.id)
    return DeveloperAuthResponse(access_token=token, email=user.email)


@app.get(
    "/developer/me",
    response_model=DeveloperProfileResponse,
    summary="Get developer profile",
    tags=["Developer Auth"],
)
async def developer_me(user=Depends(get_dashboard_user)):
    subscription = developer_platform.get_latest_subscription(user.id)
    return DeveloperProfileResponse(
        email=user.email,
        has_active_subscription=developer_platform.has_active_subscription(user.id),
        latest_subscription_status=subscription["status"] if subscription else None,
        latest_subscription_reference=subscription["reference"] if subscription else None,
        latest_subscription_active_until=subscription["active_until"] if subscription else None,
    )


@app.post(
    "/developer/billing/initialize",
    response_model=DeveloperBillingInitializeResponse,
    summary="Initialize Paystack checkout",
    tags=["Developer Billing"],
)
async def initialize_developer_billing(
    payload: DeveloperBillingInitializeRequest,
    user=Depends(get_dashboard_user),
):
    try:
        payment = developer_platform.create_payment_intent(
            user_id=user.id,
            amount_kobo=default_plan_amount_kobo(),
            plan_name=payload.plan_name or default_plan_name(),
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return DeveloperBillingInitializeResponse(**payment)


@app.post(
    "/developer/billing/webhook",
    summary="Handle Paystack webhook",
    tags=["Developer Billing"],
)
async def developer_billing_webhook(request: Request, x_paystack_signature: str = Header(default="")):
    payload = await request.body()
    if not developer_platform.verify_webhook_signature(payload, x_paystack_signature):
        raise HTTPException(status_code=401, detail="Invalid Paystack signature")

    try:
        event = json.loads(payload.decode("utf-8"))
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail="Invalid webhook payload") from exc

    if event.get("event") != "charge.success":
        return {"status": "ignored"}

    try:
        result = developer_platform.apply_successful_payment(event)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {"status": "processed", "reference": result["reference"]}


@app.get(
    "/developer/api-keys",
    response_model=DeveloperApiKeysResponse,
    summary="List developer API keys",
    tags=["Developer API Keys"],
)
async def list_developer_api_keys(user=Depends(get_dashboard_user)):
    keys = developer_platform.list_api_keys(user.id)
    return DeveloperApiKeysResponse(
        has_active_subscription=developer_platform.has_active_subscription(user.id),
        keys=[
            DeveloperApiKeySummary(
                key_prefix=item.key_prefix,
                status=item.status,
                created_at=item.created_at,
                last_used_at=item.last_used_at,
            )
            for item in keys
        ],
    )


@app.get(
    "/developer/reports",
    response_model=ScreeningReportListResponse,
    summary="List recent developer screening reports",
    tags=["Developer Reports"],
)
async def list_developer_reports(user=Depends(get_dashboard_user)):
    reports = developer_platform.list_screening_reports(user.id)
    return ScreeningReportListResponse(
        reports=[
            ScreeningReportListItem(
                report_id=item.report_id,
                full_name=item.query_name,
                status=item.status,
                confidence=item.confidence,
                total_matches=item.total_matches,
                created_at=item.created_at,
            )
            for item in reports
        ]
    )


@app.get(
    "/developer/reports/{report_id}",
    response_model=ScreeningReportResponse,
    summary="Get saved screening report",
    tags=["Developer Reports"],
)
async def get_developer_report(report_id: str, user=Depends(get_dashboard_user)):
    report = developer_platform.get_screening_report(user.id, report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Screening report not found")

    return ScreeningReportResponse(
        report_id=report["report_id"],
        status=report["status"],
        confidence=report["confidence"],
        query=ScreeningQuery(**report["query"]),
        summary=ScreeningSummary(**report["summary"]),
        matches=[
            ScreeningMatchRecord(
                match_type=item["match_type"],
                confidence=item["confidence"],
                record=ConvictionRecord(**item["record"]),
            )
            for item in report["matches"]
        ],
        created_at=report["created_at"],
    )


@app.post(
    "/developer/api-keys/rotate",
    response_model=DeveloperApiKeyIssueResponse,
    summary="Rotate developer API key",
    tags=["Developer API Keys"],
)
async def rotate_developer_api_key(user=Depends(get_dashboard_user)):
    if not developer_platform.has_active_subscription(user.id):
        raise HTTPException(
            status_code=403,
            detail="Complete Paystack payment before generating API keys",
        )

    api_key = developer_platform.create_or_rotate_api_key(user.id)
    return DeveloperApiKeyIssueResponse(
        api_key=api_key,
        message="Store this API key now. FraudCheckr will not show it again.",
    )


@app.get(
    "/convictions",
    response_model=PaginatedResponse,
    summary="Get All Convictions",
    tags=["Convictions"]
)
async def get_convictions(
    limit: int = Query(10, ge=1, le=1000, description="Number of records to return"),
    offset: int = Query(0, ge=0, description="Number of records to skip")
):
    """
    Retrieve all conviction records with pagination.
    
    Args:
        limit: Number of records per page (max 1000)
        offset: Number of records to skip
        
    Returns:
        Paginated list of conviction records
    """
    if not convictions_data:
        raise HTTPException(status_code=404, detail="No conviction data loaded")
    
    # Validate offset
    if offset >= len(convictions_data):
        raise HTTPException(
            status_code=400,
            detail=f"Offset {offset} exceeds total records {len(convictions_data)}"
        )
    
    # Slice data
    paginated = convictions_data[offset:offset + limit]
    
    return PaginatedResponse(
        total=len(convictions_data),
        limit=limit,
        offset=offset,
        data=[ConvictionRecord(**record) for record in paginated]
    )


@app.get(
    "/developer/v1/convictions",
    response_model=PaginatedResponse,
    summary="Paid developer API: get convictions",
    tags=["Developer API"],
)
async def developer_get_convictions(
    limit: int = Query(10, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    user=Depends(get_paid_api_user),
):
    del user
    return await get_convictions(limit=limit, offset=offset)


@app.get(
    "/search",
    response_model=PaginatedResponse,
    summary="Search by Defendant Name",
    tags=["Search"]
)
async def search_by_name(
    name: str = Query(..., min_length=1, description="Defendant name (case-insensitive)"),
    limit: int = Query(10, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """
    Search conviction records by defendant name.
    
    Args:
        name: Defendant name to search (partial match)
        limit: Number of records per page
        offset: Number of records to skip
        
    Returns:
        Matching conviction records (paginated)
    """
    if not convictions_data:
        raise HTTPException(status_code=404, detail="No conviction data loaded")
    
    # Normalize search term
    search_term = name.strip().upper()
    
    # Filter records
    matches = [
        r for r in convictions_data
        if search_term in r.get('name', '').upper()
    ]
    
    if not matches:
        return PaginatedResponse(
            total=0,
            limit=limit,
            offset=offset,
            data=[]
        )
    
    # Paginate
    paginated = matches[offset:offset + limit]
    
    return PaginatedResponse(
        total=len(matches),
        limit=limit,
        offset=offset,
        data=[ConvictionRecord(**record) for record in paginated]
    )


@app.get(
    "/developer/v1/search",
    response_model=PaginatedResponse,
    summary="Paid developer API: search by defendant name",
    tags=["Developer API"],
)
async def developer_search_by_name(
    name: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    user=Depends(get_paid_api_user),
):
    del user
    return await search_by_name(name=name, limit=limit, offset=offset)


@app.get(
    "/offense",
    response_model=PaginatedResponse,
    summary="Filter by Offense Type",
    tags=["Filter"]
)
async def filter_by_offense(
    type: str = Query(..., min_length=1, alias="type", description="Offense type (case-insensitive)"),
    limit: int = Query(10, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """
    Filter conviction records by offense type.
    
    Args:
        type: Offense type to filter by (partial match)
        limit: Number of records per page
        offset: Number of records to skip
        
    Returns:
        Matching conviction records (paginated)
    """
    if not convictions_data:
        raise HTTPException(status_code=404, detail="No conviction data loaded")
    
    # Normalize search term
    search_term = type.strip().upper()
    
    # Filter records
    matches = [
        r for r in convictions_data
        if search_term in r.get('offense', '').upper()
    ]
    
    if not matches:
        return PaginatedResponse(
            total=0,
            limit=limit,
            offset=offset,
            data=[]
        )
    
    # Paginate
    paginated = matches[offset:offset + limit]
    
    return PaginatedResponse(
        total=len(matches),
        limit=limit,
        offset=offset,
        data=[ConvictionRecord(**record) for record in paginated]
    )


@app.get(
    "/developer/v1/offense",
    response_model=PaginatedResponse,
    summary="Paid developer API: filter by offense",
    tags=["Developer API"],
)
async def developer_filter_by_offense(
    type: str = Query(..., min_length=1, alias="type"),
    limit: int = Query(10, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    user=Depends(get_paid_api_user),
):
    del user
    return await filter_by_offense(type=type, limit=limit, offset=offset)


@app.get(
    "/court",
    response_model=PaginatedResponse,
    summary="Filter by Court",
    tags=["Filter"]
)
async def filter_by_court(
    name: str = Query(..., min_length=1, description="Court name (case-insensitive)"),
    limit: int = Query(10, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """
    Filter conviction records by court.
    
    Args:
        name: Court name to filter by (partial match)
        limit: Number of records per page
        offset: Number of records to skip
        
    Returns:
        Matching conviction records (paginated)
    """
    if not convictions_data:
        raise HTTPException(status_code=404, detail="No conviction data loaded")
    
    # Normalize search term
    search_term = name.strip().upper()
    
    # Filter records
    matches = [
        r for r in convictions_data
        if search_term in r.get('court', '').upper()
    ]
    
    if not matches:
        return PaginatedResponse(
            total=0,
            limit=limit,
            offset=offset,
            data=[]
        )
    
    # Paginate
    paginated = matches[offset:offset + limit]
    
    return PaginatedResponse(
        total=len(matches),
        limit=limit,
        offset=offset,
        data=[ConvictionRecord(**record) for record in paginated]
    )


@app.get(
    "/developer/v1/court",
    response_model=PaginatedResponse,
    summary="Paid developer API: filter by court",
    tags=["Developer API"],
)
async def developer_filter_by_court(
    name: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    user=Depends(get_paid_api_user),
):
    del user
    return await filter_by_court(name=name, limit=limit, offset=offset)


@app.get(
    "/stats",
    response_model=StatsResponse,
    summary="Get Statistics",
    tags=["Analytics"]
)
async def get_stats():
    """
    Get statistics about conviction data.
    
    Returns:
        - total_cases: Total number of convictions
        - most_common_offense: Most frequently occurring offense
        - average_prison_term_months: Average prison term in months
        - unique_courts: Number of distinct courts
        - unique_offenses: Number of distinct offenses
    """
    if not convictions_data:
        raise HTTPException(status_code=404, detail="No conviction data loaded")
    
    # Convert to DataFrame for analysis
    df = pd.DataFrame(convictions_data)
    
    # Total cases
    total_cases = len(df)
    
    # Most common offense
    offense_counts = df['offense'].value_counts()
    most_common_offense = offense_counts.idxmax() if len(offense_counts) > 0 else "N/A"
    
    # Average prison term (only consider numeric values)
    prison_terms = df[df['prison_term_months'].notna()]['prison_term_months']
    avg_prison_months = float(prison_terms.mean()) if len(prison_terms) > 0 else None
    
    # Unique courts
    unique_courts = df['court'].nunique()
    
    # Unique offenses
    unique_offenses = df['offense'].nunique()
    
    return StatsResponse(
        total_cases=total_cases,
        most_common_offense=most_common_offense,
        average_prison_term_months=avg_prison_months,
        unique_courts=unique_courts,
        unique_offenses=unique_offenses
    )


@app.get(
    "/developer/v1/stats",
    response_model=StatsResponse,
    summary="Paid developer API: statistics",
    tags=["Developer API"],
)
async def developer_get_stats(user=Depends(get_paid_api_user)):
    del user
    return await get_stats()


@app.post(
    "/developer/v1/screen",
    response_model=ScreeningReportResponse,
    summary="Paid developer API: create screening report",
    tags=["Developer API"],
)
async def developer_screen_person(
    payload: ScreeningRequest,
    user=Depends(get_paid_api_user),
):
    if not convictions_data:
        raise HTTPException(status_code=404, detail="No conviction data loaded")

    normalized_name = normalize_screening_value(payload.full_name)
    normalized_aliases = [
        normalized_alias
        for normalized_alias in (normalize_screening_value(alias) for alias in payload.aliases)
        if normalized_alias
    ]
    normalized_location = normalize_screening_value(payload.location) or None

    report = build_screening_report(
        query_name=normalized_name,
        aliases=normalized_aliases,
        location=normalized_location,
        limit=payload.limit,
    )
    report_id = developer_platform.create_screening_report(
        user_id=user.id,
        query_name=normalized_name,
        query_aliases=normalized_aliases,
        query_location=normalized_location,
        status=report["status"],
        confidence=report["confidence"],
        exact_matches=report["summary"]["exact_matches"],
        possible_matches=report["summary"]["possible_matches"],
        total_matches=report["summary"]["total_matches"],
        matches=report["matches"],
    )

    saved_report = developer_platform.get_screening_report(user.id, report_id)
    if saved_report is None:
        raise HTTPException(status_code=500, detail="Unable to load saved screening report")

    return ScreeningReportResponse(
        report_id=saved_report["report_id"],
        status=saved_report["status"],
        confidence=saved_report["confidence"],
        query=ScreeningQuery(**saved_report["query"]),
        summary=ScreeningSummary(**saved_report["summary"]),
        matches=[
            ScreeningMatchRecord(
                match_type=item["match_type"],
                confidence=item["confidence"],
                record=ConvictionRecord(**item["record"]),
            )
            for item in saved_report["matches"]
        ],
        created_at=saved_report["created_at"],
    )


# ============================================================================
# ERROR HANDLING
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
