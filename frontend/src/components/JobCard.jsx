function JobCard({ title, company, location, type}){
    return (
        <div>
            <h2>{title}</h2>
            <p>{company}</p>
            <p>{location}</p>
            <p>{type}</p>
        </div>
    )
}

export default JobCard