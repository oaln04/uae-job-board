from __future__ import annotations

import hashlib
import html
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote, quote_plus, urljoin
from urllib.request import Request, urlopen

CACHE_PATH = Path(__file__).parent / "data" / "jobs_cache.json"

SOURCE_NAMES = ["LinkedIn", "Indeed", "Bayt", "GulfTalent"]

SEARCH_QUERIES = [
    "software engineer",
    "software engineering intern",
    "frontend developer",
    "backend engineer",
    "full stack developer",
    "machine learning engineer",
    "ai engineer",
    "data engineer",
    "devops engineer",
    "cloud engineer",
    "computer vision engineer",
]

SEED_JOBS = [
    {
        "id": "seed-careem-software-engineer",
        "title": "Software Engineer",
        "company": "Careem",
        "location": "Dubai",
        "type": "Full-time",
        "specialty": "Software Engineering",
        "source": "Curated seed",
        "url": "https://www.careem.com/careers/",
        "description": "Build product features, APIs, and reliable services for a regional technology platform.",
        "skills": ["Python", "Java", "APIs", "Distributed Systems"],
        "posted_at": "",
    },
    {
        "id": "seed-noon-frontend-developer",
        "title": "Frontend Developer",
        "company": "Noon",
        "location": "Dubai",
        "type": "Full-time",
        "specialty": "Frontend",
        "source": "Curated seed",
        "url": "https://www.noon.com/uae-en/careers/",
        "description": "Create customer-facing web experiences with modern JavaScript and component systems.",
        "skills": ["JavaScript", "React", "CSS", "Frontend"],
        "posted_at": "",
    },
    {
        "id": "seed-talabat-backend-engineer",
        "title": "Backend Engineer",
        "company": "Talabat",
        "location": "Abu Dhabi",
        "type": "Full-time",
        "specialty": "Backend",
        "source": "Curated seed",
        "url": "https://www.talabat.com/uae/careers",
        "description": "Work on backend services, data models, integrations, and platform reliability.",
        "skills": ["Python", "Java", "SQL", "Microservices"],
        "posted_at": "",
    },
    {
        "id": "seed-g42-ml-engineer",
        "title": "Machine Learning Engineer",
        "company": "G42",
        "location": "Abu Dhabi",
        "type": "Full-time",
        "specialty": "AI/ML",
        "source": "Curated seed",
        "url": "https://www.g42.ai/careers",
        "description": "Build ML pipelines, evaluate models, and deploy AI systems for production use.",
        "skills": ["Python", "Machine Learning", "PyTorch", "MLOps"],
        "posted_at": "",
    },
    {
        "id": "seed-bayut-data-engineer",
        "title": "Data Engineer",
        "company": "Bayut",
        "location": "Dubai",
        "type": "Full-time",
        "specialty": "Data Engineering",
        "source": "Curated seed",
        "url": "https://www.bayut.com/careers/",
        "description": "Design data pipelines, analytics datasets, and reliable data workflows.",
        "skills": ["Python", "SQL", "ETL", "Airflow"],
        "posted_at": "",
    },
    {
        "id": "seed-tii-ai-research-intern",
        "title": "AI Research Intern",
        "company": "Technology Innovation Institute",
        "location": "Abu Dhabi",
        "type": "Internship",
        "specialty": "AI/ML",
        "source": "Curated seed",
        "url": "https://www.tii.ae/careers",
        "description": "Support applied AI research, experiments, model evaluation, and technical reports.",
        "skills": ["Python", "Research", "Machine Learning", "Deep Learning"],
        "posted_at": "",
    },
    {
        "id": "seed-microsoft-cloud-engineer",
        "title": "Cloud Software Engineer",
        "company": "Microsoft",
        "location": "Dubai",
        "type": "Full-time",
        "specialty": "Cloud",
        "source": "Curated seed",
        "url": "https://careers.microsoft.com/",
        "description": "Build cloud-native systems and help customers use scalable cloud infrastructure.",
        "skills": ["Azure", "Cloud", "Kubernetes", "DevOps"],
        "posted_at": "",
    },
    {
        "id": "seed-presight-computer-vision",
        "title": "Computer Vision Engineer",
        "company": "Presight",
        "location": "Abu Dhabi",
        "type": "Full-time",
        "specialty": "AI/ML",
        "source": "Curated seed",
        "url": "https://presight.ai/careers/",
        "description": "Develop computer vision models and deploy AI capabilities for analytics products.",
        "skills": ["Python", "Computer Vision", "OpenCV", "PyTorch"],
        "posted_at": "",
    },
    {
        "id": "seed-kitopi-devops",
        "title": "DevOps Engineer",
        "company": "Kitopi",
        "location": "Dubai",
        "type": "Full-time",
        "specialty": "DevOps",
        "source": "Curated seed",
        "url": "https://www.kitopi.com/careers",
        "description": "Own CI/CD workflows, infrastructure automation, and production observability.",
        "skills": ["AWS", "Docker", "Kubernetes", "CI/CD"],
        "posted_at": "",
    },
    {
        "id": "seed-amazon-software-intern",
        "title": "Software Engineering Intern",
        "company": "Amazon",
        "location": "Dubai",
        "type": "Internship",
        "specialty": "Software Engineering",
        "source": "Curated seed",
        "url": "https://www.amazon.jobs/",
        "description": "Join an engineering team as an intern and work on software delivery with mentors.",
        "skills": ["Java", "Python", "Algorithms", "Data Structures"],
        "posted_at": "",
    },
]

SKILL_TERMS = [
    "python",
    "java",
    "javascript",
    "typescript",
    "react",
    "node",
    "fastapi",
    "django",
    "sql",
    "postgresql",
    "mysql",
    "mongodb",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "ci/cd",
    "devops",
    "machine learning",
    "deep learning",
    "pytorch",
    "tensorflow",
    "nlp",
    "computer vision",
    "opencv",
    "data engineering",
    "airflow",
    "spark",
    "etl",
    "apis",
    "microservices",
    "distributed systems",
    "algorithms",
    "data structures",
]

SPECIALTY_KEYWORDS = {
    "AI/ML": ["machine learning", "ai", "deep learning", "computer vision", "nlp", "pytorch", "tensorflow"],
    "Frontend": ["frontend", "front-end", "react", "javascript", "typescript", "css", "ui"],
    "Backend": ["backend", "back-end", "api", "microservice", "server", "django", "fastapi"],
    "Data Engineering": ["data engineer", "etl", "airflow", "spark", "pipeline", "sql"],
    "DevOps": ["devops", "cloud", "aws", "azure", "docker", "kubernetes", "ci/cd"],
    "Cloud": ["cloud", "aws", "azure", "gcp", "kubernetes"],
}

STOPWORDS = {
    "and",
    "the",
    "for",
    "with",
    "from",
    "this",
    "that",
    "you",
    "your",
    "are",
    "will",
    "job",
    "role",
    "work",
    "team",
    "uae",
    "dubai",
    "abu",
    "dhabi",
}


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _stable_id(parts: list[str]) -> str:
    digest = hashlib.sha1("|".join(parts).lower().encode("utf-8")).hexdigest()[:14]
    return f"job-{digest}"


def _clean_text(value: Any) -> str:
    if value is None:
        return ""
    return re.sub(r"\s+", " ", html.unescape(str(value))).strip()


def _as_list(value: Any) -> list[Any]:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def infer_type(title: str, description: str = "") -> str:
    text = f"{title} {description}".lower()
    if any(term in text for term in ["intern", "internship", "graduate program", "trainee"]):
        return "Internship"
    if "contract" in text:
        return "Contract"
    if "part-time" in text or "part time" in text:
        return "Part-time"
    return "Full-time"


def infer_specialty(title: str, description: str = "", skills: list[str] | None = None) -> str:
    text = f"{title} {description} {' '.join(skills or [])}".lower()
    for specialty, keywords in SPECIALTY_KEYWORDS.items():
        if any(keyword in text for keyword in keywords):
            return specialty
    return "Software Engineering"


def infer_location(location: Any) -> str:
    text = _clean_text(location).lower()
    if isinstance(location, dict):
        text = _clean_text(json.dumps(location)).lower()
    if "abu dhabi" in text:
        return "Abu Dhabi"
    if "dubai" in text:
        return "Dubai"
    if "sharjah" in text:
        return "Sharjah"
    if "remote" in text:
        return "Remote / UAE"
    if "united arab emirates" in text or "uae" in text:
        return "UAE"
    return _clean_text(location) or "UAE"


def extract_skills(text: str) -> list[str]:
    lowered = text.lower()
    matched = []
    for term in SKILL_TERMS:
        if term in lowered:
            matched.append(term.upper() if term in {"sql", "aws", "gcp", "nlp"} else term.title())
    return sorted(set(matched))


def build_filter_options(jobs: list[dict[str, Any]]) -> dict[str, list[str]]:
    return {
        "locations": sorted({job["location"] for job in jobs if job.get("location")}),
        "types": sorted({job["type"] for job in jobs if job.get("type")}),
        "specialties": sorted({job["specialty"] for job in jobs if job.get("specialty")}),
        "sources": sorted({job["source"] for job in jobs if job.get("source")}),
    }


def normalize_job(job: dict[str, Any]) -> dict[str, Any]:
    title = _clean_text(job.get("title")) or "Untitled role"
    company = _clean_text(job.get("company")) or "Unknown company"
    description = _clean_text(job.get("description"))
    skills = job.get("skills") or extract_skills(f"{title} {description}")
    source = _clean_text(job.get("source")) or "Unknown source"
    url = _clean_text(job.get("url"))
    location = infer_location(job.get("location"))
    job_type = _clean_text(job.get("type")) or infer_type(title, description)
    specialty = _clean_text(job.get("specialty")) or infer_specialty(title, description, skills)

    return {
        "id": _clean_text(job.get("id")) or _stable_id([source, url, title, company, location]),
        "title": title,
        "company": company,
        "location": location,
        "type": job_type,
        "specialty": specialty,
        "source": source,
        "url": url,
        "description": description,
        "skills": skills,
        "posted_at": _clean_text(job.get("posted_at")),
    }


def dedupe_jobs(jobs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    seen = set()
    deduped = []
    for raw_job in jobs:
        job = normalize_job(raw_job)
        key = job["url"].lower() or "|".join(
            [job["title"].lower(), job["company"].lower(), job["location"].lower(), job["source"].lower()]
        )
        if key in seen:
            continue
        seen.add(key)
        deduped.append(job)
    return deduped


def load_cached_jobs() -> list[dict[str, Any]]:
    if not CACHE_PATH.exists():
        return []
    try:
        data = json.loads(CACHE_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return []
    return dedupe_jobs(data.get("jobs", []))


def save_cached_jobs(jobs: list[dict[str, Any]], source_status: list[dict[str, Any]]) -> None:
    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "last_updated": _utc_now(),
        "source_status": source_status,
        "jobs": dedupe_jobs(jobs),
    }
    CACHE_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def get_all_jobs() -> list[dict[str, Any]]:
    return dedupe_jobs(load_cached_jobs() + SEED_JOBS)


def filter_jobs(
    jobs: list[dict[str, Any]],
    query: str = "",
    location: str = "",
    job_type: str = "",
    specialty: str = "",
    source: str = "",
) -> list[dict[str, Any]]:
    normalized_query = query.strip().lower()
    normalized_location = location.strip().lower()
    normalized_type = job_type.strip().lower()
    normalized_specialty = specialty.strip().lower()
    normalized_source = source.strip().lower()

    def matches(job: dict[str, Any]) -> bool:
        searchable_text = " ".join(
            [
                job.get("title", ""),
                job.get("company", ""),
                job.get("location", ""),
                job.get("type", ""),
                job.get("specialty", ""),
                job.get("source", ""),
                job.get("description", ""),
                " ".join(job.get("skills", [])),
            ]
        ).lower()

        return (
            (not normalized_query or normalized_query in searchable_text)
            and (not normalized_location or job.get("location", "").lower() == normalized_location)
            and (not normalized_type or job.get("type", "").lower() == normalized_type)
            and (not normalized_specialty or job.get("specialty", "").lower() == normalized_specialty)
            and (not normalized_source or job.get("source", "").lower() == normalized_source)
        )

    return [job for job in jobs if matches(job)]


def _build_search_url(source: str, query: str) -> str:
    if source == "LinkedIn":
        return (
            "https://www.linkedin.com/jobs/search/?"
            f"keywords={quote_plus(query)}&location={quote_plus('United Arab Emirates')}"
        )
    if source == "Indeed":
        return f"https://ae.indeed.com/jobs?q={quote_plus(query)}&l={quote_plus('United Arab Emirates')}"
    if source == "Bayt":
        slug = quote(query.lower().replace(" ", "-"))
        return f"https://www.bayt.com/en/uae/jobs/{slug}-jobs/"
    if source == "GulfTalent":
        return f"https://www.gulftalent.com/uae/jobs?q={quote_plus(query)}"
    raise ValueError(f"Unknown source: {source}")


def _fetch_public_page(url: str) -> str:
    request = Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 UAEJobBoardBot/0.1 (+https://joboardae.oaln04.xyz)",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
    )
    with urlopen(request, timeout=12) as response:
        return response.read().decode("utf-8", errors="ignore")


def _walk_json(value: Any) -> list[dict[str, Any]]:
    jobs = []
    if isinstance(value, dict):
        job_type = value.get("@type")
        job_types = [job_type] if isinstance(job_type, str) else job_type or []
        if any(str(item).lower() == "jobposting" for item in _as_list(job_types)):
            jobs.append(value)
        for child in value.values():
            jobs.extend(_walk_json(child))
    elif isinstance(value, list):
        for child in value:
            jobs.extend(_walk_json(child))
    return jobs


def _extract_json_ld_jobs(page_html: str, source: str, base_url: str) -> list[dict[str, Any]]:
    jobs = []
    scripts = re.findall(
        r"<script[^>]+type=[\"']application/ld\+json[\"'][^>]*>(.*?)</script>",
        page_html,
        flags=re.IGNORECASE | re.DOTALL,
    )
    for script in scripts:
        try:
            parsed = json.loads(html.unescape(script.strip()))
        except json.JSONDecodeError:
            continue
        for posting in _walk_json(parsed):
            company = posting.get("hiringOrganization") or {}
            if isinstance(company, dict):
                company_name = company.get("name", "")
            else:
                company_name = company
            url = _clean_text(posting.get("url")) or base_url
            description = _clean_text(posting.get("description"))
            title = _clean_text(posting.get("title"))
            if not title:
                continue
            jobs.append(
                normalize_job(
                    {
                        "title": title,
                        "company": company_name,
                        "location": posting.get("jobLocation"),
                        "type": _clean_text(posting.get("employmentType")) or infer_type(title, description),
                        "source": source,
                        "url": urljoin(base_url, url),
                        "description": description,
                        "posted_at": _clean_text(posting.get("datePosted")),
                    }
                )
            )
    return jobs


def _extract_generic_links(page_html: str, source: str, base_url: str) -> list[dict[str, Any]]:
    jobs = []
    link_pattern = re.compile(r"<a[^>]+href=[\"']([^\"']+)[\"'][^>]*>(.*?)</a>", re.IGNORECASE | re.DOTALL)
    title_terms = [
        "engineer",
        "developer",
        "software",
        "machine learning",
        "data",
        "devops",
        "cloud",
        "intern",
        "ai",
    ]

    for href, label_html in link_pattern.findall(page_html):
        label = _clean_text(re.sub(r"<[^>]+>", " ", label_html))
        lowered = label.lower()
        if len(label) < 8 or not any(term in lowered for term in title_terms):
            continue
        if not any(term in href.lower() for term in ["job", "career", "vacanc", "position"]):
            continue
        description = f"{label} listing found on {source}."
        jobs.append(
            normalize_job(
                {
                    "title": label[:120],
                    "company": "Unknown company",
                    "location": "UAE",
                    "type": infer_type(label),
                    "specialty": infer_specialty(label, description),
                    "source": source,
                    "url": urljoin(base_url, href),
                    "description": description,
                }
            )
        )

    return jobs[:20]


def scrape_source(source: str, limit_per_source: int = 12) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    source_jobs = []
    errors = []
    urls_checked = 0

    for query in SEARCH_QUERIES:
        if len(source_jobs) >= limit_per_source:
            break
        url = _build_search_url(source, query)
        urls_checked += 1
        try:
            page_html = _fetch_public_page(url)
        except (HTTPError, URLError, TimeoutError, OSError) as exc:
            errors.append(f"{query}: {exc}")
            continue

        extracted = _extract_json_ld_jobs(page_html, source, url)
        if not extracted:
            extracted = _extract_generic_links(page_html, source, url)
        source_jobs.extend(extracted)

    deduped = dedupe_jobs(source_jobs)[:limit_per_source]
    return deduped, {
        "source": source,
        "jobs_found": len(deduped),
        "urls_checked": urls_checked,
        "errors": errors[:3],
        "ok": len(deduped) > 0,
    }


def refresh_jobs(limit_per_source: int = 12) -> dict[str, Any]:
    scraped_jobs = []
    source_status = []

    for source in SOURCE_NAMES:
        jobs, status = scrape_source(source, limit_per_source=limit_per_source)
        scraped_jobs.extend(jobs)
        source_status.append(status)

    merged_cached_jobs = dedupe_jobs(scraped_jobs + load_cached_jobs())
    save_cached_jobs(merged_cached_jobs, source_status)
    all_jobs = dedupe_jobs(merged_cached_jobs + SEED_JOBS)

    return {
        "jobs": all_jobs,
        "scraped_total": len(scraped_jobs),
        "total": len(all_jobs),
        "source_status": source_status,
        "filters": build_filter_options(all_jobs),
    }


def _tokens(text: str) -> set[str]:
    return {
        token
        for token in re.findall(r"[a-zA-Z][a-zA-Z+#./-]{1,}", text.lower())
        if token not in STOPWORDS and len(token) > 2
    }


def match_jobs_to_cv(cv_text: str, jobs: list[dict[str, Any]], limit: int = 6) -> list[dict[str, Any]]:
    cv = cv_text.strip()
    if not cv:
        return []

    cv_lower = cv.lower()
    cv_tokens = _tokens(cv)
    cv_skills = {skill for skill in SKILL_TERMS if skill in cv_lower}
    wants_internship = any(term in cv_lower for term in ["intern", "internship", "student", "graduate", "junior"])
    matches = []

    for job in jobs:
        job_text = " ".join(
            [
                job.get("title", ""),
                job.get("specialty", ""),
                job.get("description", ""),
                " ".join(job.get("skills", [])),
            ]
        )
        job_lower = job_text.lower()
        job_tokens = _tokens(job_text)
        job_skills = {skill.lower() for skill in job.get("skills", [])} | {
            skill for skill in SKILL_TERMS if skill in job_lower
        }

        skill_overlap = cv_skills & job_skills
        token_overlap = cv_tokens & job_tokens
        skill_score = min(len(skill_overlap) / max(len(job_skills), 1), 1.0)
        token_score = min(len(token_overlap) / 12, 1.0)
        internship_score = 1.0 if (wants_internship and job.get("type") == "Internship") else 0.35
        specialty_score = 1.0 if job.get("specialty", "").lower() in cv_lower else 0.5
        score = round((skill_score * 55 + token_score * 25 + internship_score * 10 + specialty_score * 10))

        reasons = []
        if skill_overlap:
            reasons.append("Skills overlap: " + ", ".join(sorted(skill_overlap)[:5]))
        if job.get("type") == "Internship" and wants_internship:
            reasons.append("Internship fit")
        if job.get("specialty"):
            reasons.append(f"{job['specialty']} alignment")
        if not reasons:
            reasons.append("General software profile match")

        matches.append(
            {
                "job": job,
                "score": max(1, min(score, 100)),
                "matched_skills": sorted(skill_overlap),
                "reasons": reasons[:3],
            }
        )

    return sorted(matches, key=lambda item: item["score"], reverse=True)[:limit]
