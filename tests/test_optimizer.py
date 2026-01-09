from datetime import date

import pytest

from app.core.optimizer import (
    DayType,
    build_calendar,
    expand_cluster,
    find_vacation_clusters,
)
from app.models.schemas import Holiday


class TestBuildCalendar:
    def test_marks_weekends_correctly(self):
        # Jan 4, 2026 is a Sunday, Jan 5 is Monday
        calendar = build_calendar(
            start_date=date(2026, 1, 3),  # Saturday
            end_date=date(2026, 1, 5),  # Monday
            work_days=[0, 1, 2, 3, 4],  # Mon-Fri
            holidays=[],
        )

        assert calendar[date(2026, 1, 3)][0] == DayType.WEEKEND  # Saturday
        assert calendar[date(2026, 1, 4)][0] == DayType.WEEKEND  # Sunday
        assert calendar[date(2026, 1, 5)][0] == DayType.WORKDAY  # Monday

    def test_marks_holidays_correctly(self):
        holidays = [
            Holiday(
                date=date(2026, 1, 1),
                name="New Year's Day",
                country_code="US",
                types=["Public"],
            )
        ]
        calendar = build_calendar(
            start_date=date(2026, 1, 1),
            end_date=date(2026, 1, 2),
            work_days=[0, 1, 2, 3, 4],
            holidays=holidays,
        )

        assert calendar[date(2026, 1, 1)][0] == DayType.HOLIDAY
        assert calendar[date(2026, 1, 1)][1].name == "New Year's Day"
        assert calendar[date(2026, 1, 1)][1].types == ["Public"]

    def test_respects_custom_work_days(self):
        # Work days: Tue-Sat (1-5)
        calendar = build_calendar(
            start_date=date(2026, 1, 5),  # Monday
            end_date=date(2026, 1, 11),  # Sunday
            work_days=[1, 2, 3, 4, 5],  # Tue-Sat
            holidays=[],
        )

        assert calendar[date(2026, 1, 5)][0] == DayType.WEEKEND  # Monday - off
        assert calendar[date(2026, 1, 6)][0] == DayType.WORKDAY  # Tuesday
        assert calendar[date(2026, 1, 10)][0] == DayType.WORKDAY  # Saturday
        assert calendar[date(2026, 1, 11)][0] == DayType.WEEKEND  # Sunday - off


class TestExpandCluster:
    def test_expands_to_adjacent_weekends(self):
        # Setup: Fri is workday, Sat-Sun are weekend
        calendar = build_calendar(
            start_date=date(2026, 1, 9),   # Friday
            end_date=date(2026, 1, 12),    # Monday
            work_days=[0, 1, 2, 3, 4],
            holidays=[],
        )
        dates = sorted(calendar.keys())

        # If we take Friday off (index 0), it should expand to include Sat-Sun
        start, end = expand_cluster(dates, calendar, 0, 0)

        assert start == date(2026, 1, 9)   # Friday
        assert end == date(2026, 1, 11)    # Sunday


class TestFindVacationClusters:
    def test_finds_simple_cluster(self):
        # Week with one holiday on Thursday
        holidays = [
            Holiday(
                date=date(2026, 1, 1),  # Thursday
                name="New Year's Day",
                country_code="US",
                types=["Public"],
            )
        ]
        calendar = build_calendar(
            start_date=date(2025, 12, 29),  # Monday
            end_date=date(2026, 1, 4),      # Sunday
            work_days=[0, 1, 2, 3, 4],
            holidays=holidays,
        )

        options = find_vacation_clusters(calendar, pto_days=1)

        # Should find option: take Fri Jan 2 off -> Thu-Sun = 4 days
        matching = [o for o in options if date(2026, 1, 2) in o.pto_dates]
        assert len(matching) > 0

        best = matching[0]
        assert best.pto_days_used == 1
        assert best.total_days_off >= 4  # Thu, Fri (PTO), Sat, Sun

    def test_handles_no_holidays(self):
        calendar = build_calendar(
            start_date=date(2026, 2, 2),  # Monday
            end_date=date(2026, 2, 8),    # Sunday
            work_days=[0, 1, 2, 3, 4],
            holidays=[],
        )

        options = find_vacation_clusters(calendar, pto_days=1)

        # Should still find options (taking Fri off for a 3-day weekend)
        assert len(options) > 0
        # Best efficiency should be 3 days off for 1 PTO day
        best = max(options, key=lambda o: o.efficiency_ratio)
        assert best.efficiency_ratio == 3.0

    def test_respects_max_pto_limit(self):
        calendar = build_calendar(
            start_date=date(2026, 1, 5),   # Monday
            end_date=date(2026, 1, 18),    # Sunday
            work_days=[0, 1, 2, 3, 4],
            holidays=[],
        )

        options = find_vacation_clusters(calendar, pto_days=2)

        for option in options:
            assert option.pto_days_used <= 2
