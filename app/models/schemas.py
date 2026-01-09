from datetime import date
from pydantic import BaseModel, Field


class Country(BaseModel):
    code: str
    name: str


class Holiday(BaseModel):
    date: date
    name: str
    local_name: str | None = None
    country_code: str
    types: list[str] = Field(default_factory=list)


class HolidayDetail(BaseModel):
    date: date
    name: str
    types: list[str]


class OptimizeRequest(BaseModel):
    country: str = Field(description="ISO 3166-1 alpha-2 country code")
    pto_days: int = Field(ge=1, le=30, description="Number of PTO days available")
    work_days: list[int] = Field(
        default=[0, 1, 2, 3, 4],
        description="Work days as weekday numbers (0=Monday, 6=Sunday)",
    )
    start_date: date
    end_date: date
    subdivision: str | None = Field(
        default=None, description="Optional state/region code"
    )
    max_results: int = Field(default=10, ge=1, le=50)


class VacationOption(BaseModel):
    pto_dates: list[date] = Field(description="Dates to take as PTO")
    pto_days_used: int
    total_days_off: int
    efficiency_ratio: float = Field(description="total_days_off / pto_days_used")
    start_date: date
    end_date: date
    holidays_included: list[HolidayDetail]


class OptimizeResponse(BaseModel):
    options: list[VacationOption]
    country: str
    search_range: tuple[date, date]
