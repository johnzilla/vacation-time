# Vacation Time

Maximize your time off by finding optimal vacation periods around holidays and weekends.

## What It Does

Enter your available PTO days and a date range, and Vacation Time will find the best combinations to maximize your consecutive days off. For example, with just 4 PTO days around Memorial Day, you could get 9 consecutive days off.

## Features

- **Smart optimization**: Finds vacation clusters that maximize days off per PTO day used
- **119 countries supported**: Uses public holiday data from Nager.Date API
- **Configurable work schedule**: Default Mon-Fri, but fully customizable
- **Multiple output formats**:
  - Sortable results table
  - Visual calendar modal
  - Downloadable ICS files for import to Google Calendar, Outlook, etc.
- **Filter by holiday type**: Show/hide options based on holiday types
- **Dark mode support**: Follows system theme preference

## Quick Start

### Prerequisites

- Python 3.11+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vacation-time.git
cd vacation-time

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -e .
```

### Running

```bash
uvicorn app.main:app --reload
```

Then open http://localhost:8000 in your browser.

### Running Tests

```bash
pip install -e ".[dev]"
pytest tests/ -v
```

## How It Works

1. Select your country and date range
2. Enter how many PTO days you have available
3. Optionally customize your work days
4. Click "Find Best Vacation Times"
5. Browse results in the sortable table
6. Click "View" to see a calendar visualization
7. Download ICS files to add to your calendar

## Tech Stack

- **Backend**: Python, FastAPI
- **Frontend**: HTMX, Jinja2, Pico CSS
- **Holiday Data**: [Nager.Date API](https://date.nager.at/)
- **Calendar Export**: icalendar

## License

MIT
