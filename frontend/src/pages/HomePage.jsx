import JobCard from '../components/JobCard'
import { useEffect, useMemo, useState } from 'react'
import SearchBar from '../components/SearchBar'
import CvMatcher from '../components/CvMatcher'
import { buildFilterOptions, filterJobs, matchJobsToCv, sampleJobs } from '../data/jobs'

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '/api')

const defaultFilters = {
    locations: [],
    types: [],
    specialties: [],
    sources: [],
}

function HomePage(){
    const [query, setQuery] = useState('')
    const [selectedLocation, setSelectedLocation] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const [selectedSpecialty, setSelectedSpecialty] = useState('')
    const [selectedSource, setSelectedSource] = useState('')
    const [jobs, setJobs] = useState([])
    const [filters, setFilters] = useState(defaultFilters)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [cvText, setCvText] = useState('')
    const [matches, setMatches] = useState([])
    const [matchScopeKey, setMatchScopeKey] = useState('')
    const [isMatching, setIsMatching] = useState(false)
    const [matchError, setMatchError] = useState('')

    const filterKey = useMemo(
        () => JSON.stringify([query, selectedLocation, selectedType, selectedSpecialty, selectedSource]),
        [query, selectedLocation, selectedSource, selectedSpecialty, selectedType]
    )

    const requestUrl = useMemo(() => {
        const params = new URLSearchParams()

        if (query.trim()) params.set('q', query.trim())
        if (selectedLocation) params.set('location', selectedLocation)
        if (selectedType) params.set('type', selectedType)
        if (selectedSpecialty) params.set('specialty', selectedSpecialty)
        if (selectedSource) params.set('source', selectedSource)

        const queryString = params.toString()
        return `${API_BASE_URL}/jobs${queryString ? `?${queryString}` : ''}`
    }, [query, selectedLocation, selectedType, selectedSpecialty, selectedSource])

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
                    source: selectedSource,
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
                        source: selectedSource,
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
    }, [query, requestUrl, selectedLocation, selectedSource, selectedSpecialty, selectedType])

    function clearFilters(){
        setQuery('')
        setSelectedLocation('')
        setSelectedType('')
        setSelectedSpecialty('')
        setSelectedSource('')
    }

    async function runMatch(){
        const trimmedCv = cvText.trim()

        if (trimmedCv.length < 20) {
            setMatchError('Add more CV detail first.')
            return
        }

        setIsMatching(true)
        setMatchError('')

        if (!API_BASE_URL) {
            setMatches(matchJobsToCv(trimmedCv, jobs))
            setMatchScopeKey(filterKey)
            setIsMatching(false)
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/match`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cv_text: trimmedCv,
                    limit: 6,
                    q: query,
                    location: selectedLocation,
                    type: selectedType,
                    specialty: selectedSpecialty,
                    source: selectedSource,
                }),
            })

            if (!response.ok) {
                throw new Error('CV matching is unavailable right now.')
            }

            const data = await response.json()
            setMatches(data.matches || [])
            setMatchScopeKey(filterKey)
        } catch (err) {
            setMatches(matchJobsToCv(trimmedCv, jobs))
            setMatchScopeKey(filterKey)
            setMatchError(err.message || 'Using local matching for now.')
        } finally {
            setIsMatching(false)
        }
    }

    function clearMatch(){
        setCvText('')
        setMatches([])
        setMatchScopeKey('')
        setMatchError('')
    }

    const hasActiveFilters = Boolean(query || selectedLocation || selectedType || selectedSpecialty || selectedSource)
    const activeMatches = matchScopeKey === filterKey ? matches : []
    const matchesById = new Map(activeMatches.map(match => [String(match.job.id), match]))
    const displayedJobs = activeMatches.length ? activeMatches.map(match => match.job) : jobs

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
                selectedSource={selectedSource}
                onSourceChange={setSelectedSource}
                filters={filters}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
            />

            <CvMatcher
                cvText={cvText}
                onCvTextChange={setCvText}
                onMatch={runMatch}
                onClear={clearMatch}
                isMatching={isMatching}
                matchError={matchError}
                matchCount={activeMatches.length}
                hasMatches={activeMatches.length > 0}
            />

            <section className="results-header" aria-live="polite">
                <p>
                    {isLoading
                        ? 'Searching jobs...'
                        : `${displayedJobs.length} ${displayedJobs.length === 1 ? 'role' : 'roles'} found`}
                </p>
            </section>

            {error && <p className="notice error">{error}</p>}

            {!error && !isLoading && displayedJobs.length === 0 && (
                <p className="notice">No jobs or internships match those filters yet.</p>
            )}

            <section className="job-list" aria-label="Job results">
                {displayedJobs.map(job => (
                    <JobCard key={job.id} job={job} match={matchesById.get(String(job.id))} />
                ))}
            </section>
        </main>
    )
}

export default HomePage
