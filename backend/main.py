from typing import Annotated

from fastapi import APIRouter, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.job_engine import (
    build_filter_options,
    filter_jobs,
    get_all_jobs,
    match_jobs_to_cv,
    refresh_jobs,
)

app = FastAPI(title="UAE Job Board API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

router = APIRouter()

class RefreshRequest(BaseModel):
    limit_per_source: int = Field(default=12, ge=1, le=30)


class MatchRequest(BaseModel):
    cv_text: str = Field(min_length=20)
    limit: int = Field(default=6, ge=1, le=20)
    q: str = ""
    location: str = ""
    type: str = ""
    specialty: str = ""
    source: str = ""


@router.get("/")
def root():
    return {
        "message": "UAE Job Board API",
        "jobs_endpoint": "/jobs",
        "refresh_endpoint": "/jobs/refresh",
        "match_endpoint": "/match",
    }


@router.get("/jobs")
def list_jobs(
    q: Annotated[
        str,
        Query(description="Search by title, company, location, type, or specialty"),
    ] = "",
    location: str = "",
    job_type: Annotated[str, Query(alias="type")] = "",
    specialty: str = "",
    source: str = "",
):
    all_jobs = get_all_jobs()
    filtered_jobs = filter_jobs(all_jobs, q, location, job_type, specialty, source)

    return {
        "jobs": filtered_jobs,
        "total": len(filtered_jobs),
        "filters": build_filter_options(all_jobs),
    }


@router.post("/jobs/refresh")
def refresh_job_sources(payload: RefreshRequest):
    return refresh_jobs(limit_per_source=payload.limit_per_source)


@router.post("/match")
def match_cv_to_jobs(payload: MatchRequest):
    all_jobs = get_all_jobs()
    filtered_jobs = filter_jobs(
        all_jobs,
        query=payload.q,
        location=payload.location,
        job_type=payload.type,
        specialty=payload.specialty,
        source=payload.source,
    )

    matches = match_jobs_to_cv(payload.cv_text, filtered_jobs, limit=payload.limit)

    return {
        "matches": matches,
        "total": len(matches),
        "filters": build_filter_options(all_jobs),
    }


app.include_router(router)
app.include_router(router, prefix="/api")
