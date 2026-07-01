from typing import Annotated

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="UAE Job Board API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

JOBS = [
    {
        "id": 1,
        "title": "Software Engineer",
        "company": "Careem",
        "location": "Dubai",
        "type": "Full-time",
        "specialty": "Software Engineering",
        "source": "Company careers",
        "url": "https://www.careem.com/careers/",
    },
    {
        "id": 2,
        "title": "Frontend Developer",
        "company": "Noon",
        "location": "Dubai",
        "type": "Full-time",
        "specialty": "Frontend",
        "source": "Company careers",
        "url": "https://www.noon.com/uae-en/careers/",
    },
    {
        "id": 3,
        "title": "Backend Engineer",
        "company": "Talabat",
        "location": "Abu Dhabi",
        "type": "Full-time",
        "specialty": "Backend",
        "source": "Company careers",
        "url": "https://www.talabat.com/uae/careers",
    },
    {
        "id": 4,
        "title": "Machine Learning Engineer",
        "company": "G42",
        "location": "Abu Dhabi",
        "type": "Full-time",
        "specialty": "AI/ML",
        "source": "Company careers",
        "url": "https://www.g42.ai/careers",
    },
    {
        "id": 5,
        "title": "Data Engineer",
        "company": "Bayut",
        "location": "Dubai",
        "type": "Full-time",
        "specialty": "Data Engineering",
        "source": "Company careers",
        "url": "https://www.bayut.com/careers/",
    },
    {
        "id": 6,
        "title": "AI Research Intern",
        "company": "Technology Innovation Institute",
        "location": "Abu Dhabi",
        "type": "Internship",
        "specialty": "AI/ML",
        "source": "Company careers",
        "url": "https://www.tii.ae/careers",
    },
    {
        "id": 7,
        "title": "Cloud Software Engineer",
        "company": "Microsoft",
        "location": "Dubai",
        "type": "Full-time",
        "specialty": "Cloud",
        "source": "Company careers",
        "url": "https://careers.microsoft.com/",
    },
    {
        "id": 8,
        "title": "Computer Vision Engineer",
        "company": "Presight",
        "location": "Abu Dhabi",
        "type": "Full-time",
        "specialty": "AI/ML",
        "source": "Company careers",
        "url": "https://presight.ai/careers/",
    },
    {
        "id": 9,
        "title": "DevOps Engineer",
        "company": "Kitopi",
        "location": "Dubai",
        "type": "Full-time",
        "specialty": "DevOps",
        "source": "Company careers",
        "url": "https://www.kitopi.com/careers",
    },
    {
        "id": 10,
        "title": "Software Engineering Intern",
        "company": "Amazon",
        "location": "Dubai",
        "type": "Internship",
        "specialty": "Software Engineering",
        "source": "Company careers",
        "url": "https://www.amazon.jobs/",
    },
]


def build_filter_options(jobs):
    return {
        "locations": sorted({job["location"] for job in jobs}),
        "types": sorted({job["type"] for job in jobs}),
        "specialties": sorted({job["specialty"] for job in jobs}),
    }


@app.get("/")
def root():
    return {"message": "UAE Job Board API", "jobs_endpoint": "/jobs"}


@app.get("/jobs")
def list_jobs(
    q: Annotated[
        str,
        Query(description="Search by title, company, location, type, or specialty"),
    ] = "",
    location: str = "",
    job_type: Annotated[str, Query(alias="type")] = "",
    specialty: str = "",
):
    query = q.strip().lower()
    selected_location = location.strip().lower()
    selected_type = job_type.strip().lower()
    selected_specialty = specialty.strip().lower()

    def matches(job):
        searchable_text = " ".join(
            [
                job["title"],
                job["company"],
                job["location"],
                job["type"],
                job["specialty"],
            ]
        ).lower()

        return (
            (not query or query in searchable_text)
            and (not selected_location or job["location"].lower() == selected_location)
            and (not selected_type or job["type"].lower() == selected_type)
            and (not selected_specialty or job["specialty"].lower() == selected_specialty)
        )

    filtered_jobs = [job for job in JOBS if matches(job)]

    return {
        "jobs": filtered_jobs,
        "total": len(filtered_jobs),
        "filters": build_filter_options(JOBS),
    }
