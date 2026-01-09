# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/claude-code) when working with this repository.

## Project Overview

Vacation-Time is a web application that helps users maximize their time off by finding optimal vacation periods around public holidays and weekends. Given a number of PTO days and a date range, it calculates the best combinations to get the most consecutive days off.

## Tech Stack

- **Backend**: Python 3.11+ with FastAPI
- **Frontend**: HTMX + Jinja2 templates (no build step)
- **Styling**: Pico CSS (classless CSS framework)
- **Holiday Data**: Nager.Date API (free, no API key required)
- **Calendar Export**: icalendar library for ICS file generation

## Project Structure

```
vacation-time/
├── app/
│   ├── main.py              # FastAPI entry point
│   ├── api/routes.py        # API endpoints
│   ├── core/
│   │   ├── holidays.py      # Nager.Date API client with caching
│   │   ├── optimizer.py     # Vacation optimization algorithm
│   │   └── calendar_gen.py  # ICS file generation
│   ├── models/schemas.py    # Pydantic models
│   └── templates/           # Jinja2 HTML templates
├── static/style.css         # Custom styles
├── tests/                   # Pytest tests
├── pyproject.toml           # Project configuration
└── requirements.txt         # Dependencies
```

## Common Commands

```bash
# Install dependencies
pip install -e ".[dev]"

# Run the development server
uvicorn app.main:app --reload

# Run tests
pytest tests/ -v

# Run tests with coverage
pytest tests/ --cov=app
```

## Key Design Decisions

1. **Stateless**: No database - all calculations are done on-the-fly
2. **Public holidays only**: Only "Public" type holidays from Nager.Date API are treated as days off (not School, Authorities, Observance types)
3. **Client-side filtering/sorting**: Results table supports sorting by any column and filtering by holiday type via JavaScript
4. **Timezone handling**: JavaScript date parsing uses local dates (not UTC) to avoid off-by-one errors

## API Endpoints

- `GET /` - Main page with input form
- `GET /api/countries` - List supported countries
- `POST /api/optimize` - Run optimizer (JSON)
- `POST /results` - HTMX partial for results table
- `GET /api/ics/single/{index}` - Download ICS for single option
- `GET /api/ics/all` - Download ICS with all options

## Algorithm Overview

The optimizer (`app/core/optimizer.py`):
1. Fetches public holidays for the country/date range
2. Builds a calendar marking each day as HOLIDAY, WEEKEND, or WORKDAY
3. Finds vacation "clusters" by trying different PTO allocations
4. Expands clusters to include adjacent weekends/holidays
5. Returns all unique options sorted by total days off
