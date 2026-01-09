from datetime import date

import pytest
import respx
from httpx import Response

from app.core.holidays import (
    BASE_URL,
    HolidayCache,
    get_countries,
    get_holidays,
    get_holidays_for_range,
)


class TestHolidayCache:
    def test_cache_set_and_get(self):
        cache = HolidayCache()
        cache.set("test_key", {"data": "value"})
        result = cache.get("test_key")
        assert result == {"data": "value"}

    def test_cache_returns_none_for_missing_key(self):
        cache = HolidayCache()
        result = cache.get("nonexistent")
        assert result is None


class TestGetCountries:
    @respx.mock
    @pytest.mark.asyncio
    async def test_returns_countries(self):
        respx.get(f"{BASE_URL}/AvailableCountries").mock(
            return_value=Response(
                200,
                json=[
                    {"countryCode": "US", "name": "United States"},
                    {"countryCode": "CA", "name": "Canada"},
                ],
            )
        )

        countries = await get_countries()

        assert len(countries) == 2
        assert countries[0].code == "US"
        assert countries[0].name == "United States"


class TestGetHolidays:
    @respx.mock
    @pytest.mark.asyncio
    async def test_returns_holidays_for_year(self):
        respx.get(f"{BASE_URL}/PublicHolidays/2026/US").mock(
            return_value=Response(
                200,
                json=[
                    {
                        "date": "2026-01-01",
                        "name": "New Year's Day",
                        "localName": "New Year's Day",
                        "countryCode": "US",
                    },
                    {
                        "date": "2026-07-04",
                        "name": "Independence Day",
                        "localName": "Independence Day",
                        "countryCode": "US",
                    },
                ],
            )
        )

        holidays = await get_holidays("US", 2026)

        assert len(holidays) == 2
        assert holidays[0].date == date(2026, 1, 1)
        assert holidays[0].name == "New Year's Day"


class TestGetHolidaysForRange:
    @respx.mock
    @pytest.mark.asyncio
    async def test_fetches_multiple_years(self):
        respx.get(f"{BASE_URL}/PublicHolidays/2025/US").mock(
            return_value=Response(
                200,
                json=[
                    {
                        "date": "2025-12-25",
                        "name": "Christmas Day",
                        "countryCode": "US",
                    },
                ],
            )
        )
        respx.get(f"{BASE_URL}/PublicHolidays/2026/US").mock(
            return_value=Response(
                200,
                json=[
                    {
                        "date": "2026-01-01",
                        "name": "New Year's Day",
                        "countryCode": "US",
                    },
                ],
            )
        )

        holidays = await get_holidays_for_range(
            "US",
            start_date=date(2025, 12, 1),
            end_date=date(2026, 1, 31),
        )

        assert len(holidays) == 2
        names = [h.name for h in holidays]
        assert "Christmas Day" in names
        assert "New Year's Day" in names

    @respx.mock
    @pytest.mark.asyncio
    async def test_filters_by_date_range(self):
        respx.get(f"{BASE_URL}/PublicHolidays/2026/US").mock(
            return_value=Response(
                200,
                json=[
                    {
                        "date": "2026-01-01",
                        "name": "New Year's Day",
                        "countryCode": "US",
                    },
                    {
                        "date": "2026-07-04",
                        "name": "Independence Day",
                        "countryCode": "US",
                    },
                    {
                        "date": "2026-12-25",
                        "name": "Christmas Day",
                        "countryCode": "US",
                    },
                ],
            )
        )

        holidays = await get_holidays_for_range(
            "US",
            start_date=date(2026, 1, 1),
            end_date=date(2026, 6, 30),
        )

        assert len(holidays) == 1
        assert holidays[0].name == "New Year's Day"
