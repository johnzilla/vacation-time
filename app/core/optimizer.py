from datetime import date, timedelta
from enum import Enum

from app.core.holidays import get_holidays_for_range
from app.models.schemas import Holiday, HolidayDetail, OptimizeRequest, VacationOption


class DayType(Enum):
    WORKDAY = "workday"
    WEEKEND = "weekend"
    HOLIDAY = "holiday"


def build_calendar(
    start_date: date,
    end_date: date,
    work_days: list[int],
    holidays: list[Holiday],
) -> dict[date, tuple[DayType, Holiday | None]]:
    """Build a calendar marking each day's type and holiday info if applicable."""
    holiday_map = {h.date: h for h in holidays}
    calendar: dict[date, tuple[DayType, Holiday | None]] = {}

    current = start_date
    while current <= end_date:
        if current in holiday_map:
            calendar[current] = (DayType.HOLIDAY, holiday_map[current])
        elif current.weekday() not in work_days:
            calendar[current] = (DayType.WEEKEND, None)
        else:
            calendar[current] = (DayType.WORKDAY, None)
        current += timedelta(days=1)

    return calendar


def find_vacation_clusters(
    calendar: dict[date, tuple[DayType, Holiday | None]],
    pto_days: int,
) -> list[VacationOption]:
    """Find all possible vacation clusters using up to pto_days of PTO."""
    dates = sorted(calendar.keys())
    if not dates:
        return []

    options: list[VacationOption] = []
    seen_pto_sets: set[frozenset[date]] = set()

    # For each potential starting point
    for start_idx in range(len(dates)):
        # Try different PTO allocations (1 to pto_days)
        for pto_to_use in range(1, pto_days + 1):
            option = find_best_cluster_from(
                dates, calendar, start_idx, pto_to_use
            )
            if option:
                pto_set = frozenset(option.pto_dates)
                if pto_set not in seen_pto_sets:
                    seen_pto_sets.add(pto_set)
                    options.append(option)

    return options


def find_best_cluster_from(
    dates: list[date],
    calendar: dict[date, tuple[DayType, Holiday | None]],
    start_idx: int,
    pto_to_use: int,
) -> VacationOption | None:
    """Find the best vacation cluster starting from a given index using exact PTO days."""
    # Find a workday to start PTO allocation from
    workday_indices = [
        i for i in range(start_idx, len(dates))
        if calendar[dates[i]][0] == DayType.WORKDAY
    ]

    if len(workday_indices) < pto_to_use:
        return None

    # Try to find consecutive or near-consecutive workdays to convert to PTO
    best_option: VacationOption | None = None
    best_efficiency = 0.0

    # Sliding window over workday indices
    for wi in range(len(workday_indices) - pto_to_use + 1):
        pto_indices = workday_indices[wi : wi + pto_to_use]
        pto_dates = [dates[i] for i in pto_indices]

        # Check if PTO days are reasonably close together (within 14 days span)
        if (pto_dates[-1] - pto_dates[0]).days > 14:
            continue

        # Calculate the full vacation period including adjacent non-workdays
        cluster_start, cluster_end = expand_cluster(
            dates, calendar, pto_indices[0], pto_indices[-1]
        )

        total_days = (cluster_end - cluster_start).days + 1
        efficiency = total_days / pto_to_use

        if efficiency > best_efficiency:
            holidays_in_range = [
                HolidayDetail(date=d, name=calendar[d][1].name, types=calendar[d][1].types)
                for d in dates
                if cluster_start <= d <= cluster_end
                and calendar[d][0] == DayType.HOLIDAY
                and calendar[d][1]
            ]

            best_efficiency = efficiency
            best_option = VacationOption(
                pto_dates=pto_dates,
                pto_days_used=pto_to_use,
                total_days_off=total_days,
                efficiency_ratio=round(efficiency, 2),
                start_date=cluster_start,
                end_date=cluster_end,
                holidays_included=holidays_in_range,
            )

    return best_option


def expand_cluster(
    dates: list[date],
    calendar: dict[date, tuple[DayType, Holiday | None]],
    first_pto_idx: int,
    last_pto_idx: int,
) -> tuple[date, date]:
    """Expand a cluster of PTO days to include adjacent weekends/holidays."""
    # Expand backward
    start_idx = first_pto_idx
    while start_idx > 0:
        prev_date = dates[start_idx - 1]
        if calendar[prev_date][0] in (DayType.WEEKEND, DayType.HOLIDAY):
            start_idx -= 1
        else:
            break

    # Expand forward
    end_idx = last_pto_idx
    while end_idx < len(dates) - 1:
        next_date = dates[end_idx + 1]
        if calendar[next_date][0] in (DayType.WEEKEND, DayType.HOLIDAY):
            end_idx += 1
        else:
            break

    return dates[start_idx], dates[end_idx]


async def optimize_vacation(request: OptimizeRequest) -> list[VacationOption]:
    """Main optimization function."""
    all_holidays = await get_holidays_for_range(
        request.country,
        request.start_date,
        request.end_date,
        request.subdivision,
    )

    # Only treat "Public" holidays as days off (federal/national holidays)
    # Other types (School, Authorities, Observance) are not days off for most workers
    public_holidays = [h for h in all_holidays if "Public" in h.types]

    calendar = build_calendar(
        request.start_date,
        request.end_date,
        request.work_days,
        public_holidays,
    )

    options = find_vacation_clusters(calendar, request.pto_days)

    # Sort by total days off (descending), then by efficiency, then by start date
    options.sort(key=lambda o: (-o.total_days_off, -o.efficiency_ratio, o.start_date))

    # Limit results to avoid overwhelming the UI
    return options[:50]
