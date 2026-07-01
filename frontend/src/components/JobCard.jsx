function JobCard({ job }){
    return (
        <article className="job-card">
            <div>
                <p className="company">{job.company}</p>
                <h2>{job.title}</h2>
            </div>

            <div className="job-meta">
                <span>{job.location}</span>
                <span>{job.type}</span>
                <span>{job.specialty}</span>
            </div>

            <div className="job-footer">
                <span>{job.source}</span>
                <a href={job.url} target="_blank" rel="noreferrer">View role</a>
            </div>
        </article>
    )
}

export default JobCard
