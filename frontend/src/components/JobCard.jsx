function JobCard({ job, match }){
    return (
        <article className="job-card">
            <div>
                <p className="company">{job.company}</p>
                <h2>{job.title}</h2>
                {job.description && <p className="job-description">{job.description}</p>}
            </div>

            <div className="job-meta">
                <span>{job.location}</span>
                <span>{job.type}</span>
                <span>{job.specialty}</span>
                <span>{job.source}</span>
            </div>

            {match && (
                <div className="match-card">
                    <strong>{match.score}% match</strong>
                    <ul>
                        {match.reasons.map(reason => (
                            <li key={reason}>{reason}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="job-footer">
                <span>{job.skills?.slice(0, 4).join(' • ') || 'Role details'}</span>
                <a href={job.url} target="_blank" rel="noreferrer">View role</a>
            </div>
        </article>
    )
}

export default JobCard
