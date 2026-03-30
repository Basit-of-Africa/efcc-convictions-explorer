"""
Pydantic models for EFCC Convictions Explorer API.
"""

from typing import Optional
from pydantic import BaseModel, Field


class ConvictionRecord(BaseModel):
    """Single conviction record with standardized fields."""
    
    name: str = Field(..., description="Defendant name")
    offense: str = Field(..., description="Offense type")
    prison_term: str = Field(..., description="Prison term in standardized format")
    prison_term_months: Optional[int] = Field(None, description="Prison term in numeric months")
    fine: Optional[str] = Field(None, description="Fine amount")
    restitution: Optional[str] = Field(None, description="Restitution amount")
    court: str = Field(..., description="Court name")
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "JOHN DOE",
                "offense": "FRAUD",
                "prison_term": "5 YEARS",
                "prison_term_months": 60,
                "fine": "5000000",
                "restitution": "1000000",
                "court": "FEDERAL HIGH COURT"
            }
        }


class PaginatedResponse(BaseModel):
    """Paginated response wrapper."""
    
    total: int = Field(..., description="Total number of records")
    limit: int = Field(..., description="Limit requested")
    offset: int = Field(..., description="Offset used")
    data: list[ConvictionRecord] = Field(..., description="Array of conviction records")


class StatsResponse(BaseModel):
    """Statistics response."""
    
    total_cases: int = Field(..., description="Total number of cases")
    most_common_offense: str = Field(..., description="Most frequently occurring offense")
    average_prison_term_months: Optional[float] = Field(None, description="Average prison term in months")
    unique_courts: int = Field(..., description="Number of unique courts")
    unique_offenses: int = Field(..., description="Number of unique offenses")


class HealthResponse(BaseModel):
    """Health check response."""
    
    status: str = Field(..., description="Service status")
    message: str = Field(..., description="Status message")
