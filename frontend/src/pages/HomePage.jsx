import JobCard from '../components/JobCard'
import { useEffect, useMemo, useState } from 'react'
import SearchBar from '../components/SearchBar'
import { buildFilterOptions, filterJobs, sampleJobs } from '../data/jobs'

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '')

const defaultFilters = {
    locations: [],
    types: [],
    specialties: [],
}

function HomePage(){
    const [query, setQuery] = useState('')
    const [selectedLocation, setSelectedLocation] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const [selectedSpecialty, setSelectedSpecialty] = useState('')
    const [jobs, setJobs] = useState([])
    const [filters, setFilters] = useState(defaultFilters)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const requestUrl = useMemo(() => {
        const params = new URLSearchParams()

        if (query.trim()) params.set('q', query.trim())
        if (selectedLocation) params.set('location', selectedLocation)
        if (selectedType) params.set('type', selectedType)
        if (selectedSpecialty) params.set('specialty', selectedSpecialty)

        const queryString = params.toString()
        return `${API_BASE_URL}/jobs${queryString ? `?${queryString}` : ''}`
    }, [query, selectedLocation, selectedType, selectedSpecialty])

    useEffect(() => {
        const controller = new AbortController()

        async function loadJobs(){
            setIsLoading(true)
            setError('')

            if (!API_BASE_URL) {
                const filteredJobs = filterJobs(sampleJobs, {
                    query,
                    location: selectedLocation,
                    type: selectedType,
                    specialty: selectedSpecialty,
                })

                setJobs(filteredJobs)
                setFilters(buildFilterOptions(sampleJobs))
                setIsLoading(false)
                return
            }

            try {
                const response = await fetch(requestUrl, { signal: controller.signal })

                if (!response.ok) {
                    throw new Error('Jobs could not be loaded right now.')
                }

                const data = await response.json()

                setJobs(data.jobs || [])
                setFilters(data.filters || defaultFilters)
            } catch (err) {
                if (err.name !== 'AbortError') {
                    const filteredJobs = filterJobs(sampleJobs, {
                        query,
                        location: selectedLocation,
                        type: selectedType,
                        specialty: selectedSpecialty,
                    })

                    setError('')
                    setJobs(filteredJobs)
                    setFilters(buildFilterOptions(sampleJobs))
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        loadJobs()

        return () => controller.abort()
    }, [query, requestUrl, selectedLocation, selectedSpecialty, selectedType])

    function clearFilters(){
        setQuery('')
        setSelectedLocation('')
        setSelectedType('')
        setSelectedSpecialty('')
    }

    const hasActiveFilters = Boolean(query || selectedLocation || selectedType || selectedSpecialty)

    return (
        <main className="job-board">
            <section className="board-header">
                <div>
                    <p className="eyebrow">UAE tech roles</p>
                    <h1>Find software, AI, and computer engineering jobs in one place.</h1>
                </div>
                <p className="header-copy">
                    Search across early curated listings now, with the structure ready for real aggregation next.
                </p>
            </section>

            <SearchBar
                query={query}
                onQueryChange={setQuery}
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                selectedSpecialty={selectedSpecialty}
                onSpecialtyChange={setSelectedSpecialty}
                filters={filters}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
            />

            <section className="results-header" aria-live="polite">
                <p>{isLoading ? 'Searching jobs...' : `${jobs.length} ${jobs.length === 1 ? 'job' : 'jobs'} found`}</p>
            </section>

            {error && <p className="notice error">{error}</p>}

            {!error && !isLoading && jobs.length === 0 && (
                <p className="notice">No jobs match those filters yet.</p>
            )}

            <section className="job-list" aria-label="Job results">
                {jobs.map(job => (
                    <JobCard key={job.id} job={job} />
                ))}
            </section>
        </main>
    )
}

export default HomePage
