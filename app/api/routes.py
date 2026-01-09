import json
from base64 import b64decode, b64encode

from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, Response
from fastapi.templating import Jinja2Templates

from app.core.calendar_gen import generate_ics, generate_multi_ics
from app.core.holidays import get_countries
from app.core.optimizer import optimize_vacation
from app.models.schemas import OptimizeRequest, OptimizeResponse, VacationOption

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


@router.get("/api/countries")
async def list_countries():
    """Get list of supported countries."""
    countries = await get_countries()
    return countries


@router.post("/api/optimize", response_model=OptimizeResponse)
async def optimize(request: OptimizeRequest):
    """Run vacation optimization algorithm."""
    options = await optimize_vacation(request)
    return OptimizeResponse(
        options=options,
        country=request.country,
        search_range=(request.start_date, request.end_date),
    )


@router.post("/results", response_class=HTMLResponse)
async def results_partial(request: Request):
    """HTMX endpoint for rendering results partial."""
    form = await request.form()

    # Parse work days from checkboxes
    work_days = [int(d) for d in form.getlist("work_days")]
    if not work_days:
        work_days = [0, 1, 2, 3, 4]  # Default to Mon-Fri

    opt_request = OptimizeRequest(
        country=form["country"],
        pto_days=int(form["pto_days"]),
        work_days=work_days,
        start_date=form["start_date"],
        end_date=form["end_date"],
        subdivision=form.get("subdivision") or None,
    )

    options = await optimize_vacation(opt_request)

    # Encode options for ICS download links
    options_data = [o.model_dump(mode="json") for o in options]
    encoded_options = b64encode(json.dumps(options_data).encode()).decode()

    return templates.TemplateResponse(
        "results.html",
        {
            "request": request,
            "options": options,
            "country": opt_request.country,
            "encoded_options": encoded_options,
        },
    )


@router.get("/api/ics/single/{index}")
async def download_single_ics(index: int, data: str):
    """Download ICS for a single vacation option."""
    options_data = json.loads(b64decode(data))
    if index < 0 or index >= len(options_data):
        return Response(status_code=404)

    option = VacationOption(**options_data[index])
    ics_content = generate_ics(option)

    return Response(
        content=ics_content,
        media_type="text/calendar",
        headers={"Content-Disposition": f"attachment; filename=vacation-option-{index + 1}.ics"},
    )


@router.get("/api/ics/all")
async def download_all_ics(data: str):
    """Download ICS with all vacation options."""
    options_data = json.loads(b64decode(data))
    options = [VacationOption(**o) for o in options_data]
    ics_content = generate_multi_ics(options)

    return Response(
        content=ics_content,
        media_type="text/calendar",
        headers={"Content-Disposition": "attachment; filename=vacation-options-all.ics"},
    )
