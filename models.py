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


class DeveloperSignupRequest(BaseModel):
    email: str = Field(..., description="Developer account email address")
    password: str = Field(..., min_length=8, description="Developer account password")


class DeveloperLoginRequest(BaseModel):
    email: str = Field(..., description="Developer account email address")
    password: str = Field(..., min_length=8, description="Developer account password")


class DeveloperAuthResponse(BaseModel):
    access_token: str = Field(..., description="Developer dashboard session token")
    token_type: str = Field(default="bearer", description="Token type")
    email: str = Field(..., description="Developer account email")


class DeveloperProfileResponse(BaseModel):
    email: str = Field(..., description="Developer account email")
    has_active_subscription: bool = Field(..., description="Whether the developer has an active paid subscription")
    latest_subscription_status: Optional[str] = Field(None, description="Most recent subscription status")
    latest_subscription_reference: Optional[str] = Field(None, description="Most recent Paystack reference")
    latest_subscription_active_until: Optional[str] = Field(None, description="Subscription expiry timestamp")


class DeveloperBillingInitializeRequest(BaseModel):
    plan_name: Optional[str] = Field(None, description="Optional developer plan name override")


class DeveloperBillingInitializeResponse(BaseModel):
    reference: str = Field(..., description="Paystack reference for this checkout")
    authorization_url: str = Field(..., description="Paystack payment URL")
    access_code: Optional[str] = Field(None, description="Paystack access code")
    amount_kobo: int = Field(..., description="Amount in kobo")
    plan_name: str = Field(..., description="Developer plan name")


class DeveloperApiKeySummary(BaseModel):
    key_prefix: str = Field(..., description="Visible API key prefix")
    status: str = Field(..., description="Current API key status")
    created_at: str = Field(..., description="Creation timestamp")
    last_used_at: Optional[str] = Field(None, description="Most recent usage timestamp")


class DeveloperApiKeysResponse(BaseModel):
    has_active_subscription: bool = Field(..., description="Whether the user can use developer APIs")
    keys: list[DeveloperApiKeySummary] = Field(..., description="Issued API keys")


class DeveloperApiKeyIssueResponse(BaseModel):
    api_key: str = Field(..., description="Newly issued API key shown once")
    message: str = Field(..., description="Issuance message")
