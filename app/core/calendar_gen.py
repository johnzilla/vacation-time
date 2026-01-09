from datetime import timedelta
from uuid import uuid4

from icalendar import Calendar, Event

from app.models.schemas import VacationOption


def generate_ics(option: VacationOption) -> bytes:
    """Generate an ICS file for a vacation option."""
    cal = Calendar()
    cal.add("prodid", "-//Vacation Time//vacation-time//EN")
    cal.add("version", "2.0")
    cal.add("calscale", "GREGORIAN")
    cal.add("method", "PUBLISH")
    cal.add("x-wr-calname", "Vacation Time - PTO Plan")

    # Create an all-day event spanning the full vacation period
    vacation_event = Event()
    vacation_event.add("uid", str(uuid4()))
    vacation_event.add("dtstart", option.start_date)
    vacation_event.add("dtend", option.end_date + timedelta(days=1))
    vacation_event.add("summary", "Vacation Time Off")

    description_parts = [
        f"Total days off: {option.total_days_off}",
        f"PTO days used: {option.pto_days_used}",
        f"Efficiency: {option.efficiency_ratio}x",
    ]
    if option.holidays_included:
        holiday_names = [h.name for h in option.holidays_included]
        description_parts.append(f"Holidays: {', '.join(holiday_names)}")

    vacation_event.add("description", "\n".join(description_parts))
    cal.add_component(vacation_event)

    # Create individual events for each PTO day
    for pto_date in option.pto_dates:
        pto_event = Event()
        pto_event.add("uid", str(uuid4()))
        pto_event.add("dtstart", pto_date)
        pto_event.add("dtend", pto_date + timedelta(days=1))
        pto_event.add("summary", "PTO Day")
        pto_event.add("description", "Take this day off as PTO")
        cal.add_component(pto_event)

    return cal.to_ical()


def generate_multi_ics(options: list[VacationOption]) -> bytes:
    """Generate an ICS file with multiple vacation options as separate events."""
    cal = Calendar()
    cal.add("prodid", "-//Vacation Time//vacation-time//EN")
    cal.add("version", "2.0")
    cal.add("calscale", "GREGORIAN")
    cal.add("method", "PUBLISH")
    cal.add("x-wr-calname", "Vacation Time - All Options")

    for i, option in enumerate(options, 1):
        event = Event()
        event.add("uid", str(uuid4()))
        event.add("dtstart", option.start_date)
        event.add("dtend", option.end_date + timedelta(days=1))
        event.add("summary", f"Vacation Option {i}: {option.total_days_off} days off")

        description_parts = [
            f"Option {i}",
            f"Total days off: {option.total_days_off}",
            f"PTO days used: {option.pto_days_used}",
            f"Efficiency: {option.efficiency_ratio}x",
            f"PTO dates: {', '.join(d.isoformat() for d in option.pto_dates)}",
        ]
        if option.holidays_included:
            holiday_names = [h.name for h in option.holidays_included]
            description_parts.append(f"Holidays: {', '.join(holiday_names)}")

        event.add("description", "\n".join(description_parts))
        cal.add_component(event)

    return cal.to_ical()
