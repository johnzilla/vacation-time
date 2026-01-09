import time
from datetime import date

import httpx

from app.models.schemas import Country, Holiday

BASE_URL = "https://date.nager.at/api/v3"
CACHE_TTL = 3600  # 1 hour


class HolidayCache:
    def __init__(self) -> None:
        self._cache: dict[str, tuple[float, object]] = {}

    def get(self, key: str) -> object | None:
        if key in self._cache:
            timestamp, value = self._cache[key]
            if time.time() - timestamp < CACHE_TTL:
                return value
            del self._cache[key]
        return None

    def set(self, key: str, value: object) -> None:
        self._cache[key] = (time.time(), value)


_cache = HolidayCache()


async def get_countries() -> list[Country]:
    cached = _cache.get("countries")
    if cached:
        return cached  # type: ignore

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/AvailableCountries")
        response.raise_for_status()
        data = response.json()

    countries = [Country(code=c["countryCode"], name=c["name"]) for c in data]
    _cache.set("countries", countries)
    return countries


async def get_holidays(
    country_code: str, year: int, subdivision: str | None = None
) -> list[Holiday]:
    cache_key = f"holidays:{country_code}:{year}:{subdivision or ''}"
    cached = _cache.get(cache_key)
    if cached:
        return cached  # type: ignore

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/PublicHolidays/{year}/{country_code}")
        response.raise_for_status()
        data = response.json()

    holidays = []
    for h in data:
        # Filter by subdivision if specified
        if subdivision:
            counties = h.get("counties")
            if counties and subdivision not in counties:
                continue

        holidays.append(
            Holiday(
                date=date.fromisoformat(h["date"]),
                name=h["name"],
                local_name=h.get("localName"),
                country_code=h["countryCode"],
                types=h.get("types", []),
            )
        )

    _cache.set(cache_key, holidays)
    return holidays


async def get_holidays_for_range(
    country_code: str,
    start_date: date,
    end_date: date,
    subdivision: str | None = None,
) -> list[Holiday]:
    years = set(range(start_date.year, end_date.year + 1))
    all_holidays: list[Holiday] = []

    for year in years:
        holidays = await get_holidays(country_code, year, subdivision)
        all_holidays.extend(holidays)

    # Filter to date range
    return [h for h in all_holidays if start_date <= h.date <= end_date]
