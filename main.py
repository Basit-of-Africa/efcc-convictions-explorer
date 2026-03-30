"""
FastAPI application for EFCC Convictions Explorer.

A REST API for searching and analyzing EFCC conviction records.
"""

import os
from pathlib import Path
from contextlib import asynccontextmanager
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from models import ConvictionRecord, PaginatedResponse, StatsResponse, HealthResponse
from data_cleaning import process_efcc_data


# Global dataset (loaded at startup)
convictions_data: list[dict] = []


def load_conviction_data():
    """Load and process conviction data."""
    global convictions_data
    
    # Try to load from CSV file - check multiple locations
    possible_paths = [
        Path("efcc_convictions.csv"),
        Path(__file__).parent / "efcc_convictions.csv",
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
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://0.0.0.0:3000",
        "http://0.0.0.0:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
