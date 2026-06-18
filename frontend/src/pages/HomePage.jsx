import JobCard from '../components/JobCard'
import { useState } from 'react'
import SearchBar from '../components/SearchBar'

const jobs = [
  { id: 1, title: "Software Engineer", company: "Careem", location: "Dubai", type: "Full-time" },
  { id: 2, title: "Frontend Developer", company: "Noon", location: "Dubai", type: "Full-time" },
  { id: 3, title: "Backend Engineer", company: "Talabat", location: "Abu Dhabi", type: "Full-time" }
]

function HomePage(){
    const [query, setQuery] = useState('')

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.location.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase()) ||
        job.type.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <div>
            <h1>UAE Job Board</h1>
            <p>Find your next role.</p>

            <SearchBar query={query} onQueryChange={setQuery}/>
            {filteredJobs.map(job => (
                <JobCard
                key={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                type={job.type}
                />
            ))}
        </div>
    )
}

export default HomePage