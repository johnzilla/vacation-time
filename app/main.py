from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.api.routes import router
from app.core.holidays import get_countries

app = FastAPI(
    title="Vacation Time",
    description="Maximize your time off by finding optimal vacation periods around holidays",
    version="0.1.0",
)

app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(router)

templates = Jinja2Templates(directory="app/templates")


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Render the main page."""
    countries = await get_countries()
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "countries": countries},
    )
