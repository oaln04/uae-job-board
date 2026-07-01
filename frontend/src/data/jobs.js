export const sampleJobs = [
    {
        id: 1,
        title: 'Software Engineer',
        company: 'Careem',
        location: 'Dubai',
        type: 'Full-time',
        specialty: 'Software Engineering',
        source: 'Company careers',
        url: 'https://www.careem.com/careers/',
    },
    {
        id: 2,
        title: 'Frontend Developer',
        company: 'Noon',
        location: 'Dubai',
        type: 'Full-time',
        specialty: 'Frontend',
        source: 'Company careers',
        url: 'https://www.noon.com/uae-en/careers/',
    },
    {
        id: 3,
        title: 'Backend Engineer',
        company: 'Talabat',
        location: 'Abu Dhabi',
        type: 'Full-time',
        specialty: 'Backend',
        source: 'Company careers',
        url: 'https://www.talabat.com/uae/careers',
    },
    {
        id: 4,
        title: 'Machine Learning Engineer',
        company: 'G42',
        location: 'Abu Dhabi',
        type: 'Full-time',
        specialty: 'AI/ML',
        source: 'Company careers',
        url: 'https://www.g42.ai/careers',
    },
    {
        id: 5,
        title: 'Data Engineer',
        company: 'Bayut',
        location: 'Dubai',
        type: 'Full-time',
        specialty: 'Data Engineering',
        source: 'Company careers',
        url: 'https://www.bayut.com/careers/',
    },
    {
        id: 6,
        title: 'AI Research Intern',
        company: 'Technology Innovation Institute',
        location: 'Abu Dhabi',
        type: 'Internship',
        specialty: 'AI/ML',
        source: 'Company careers',
        url: 'https://www.tii.ae/careers',
    },
    {
        id: 7,
        title: 'Cloud Software Engineer',
        company: 'Microsoft',
        location: 'Dubai',
        type: 'Full-time',
        specialty: 'Cloud',
        source: 'Company careers',
        url: 'https://careers.microsoft.com/',
    },
    {
        id: 8,
        title: 'Computer Vision Engineer',
        company: 'Presight',
        location: 'Abu Dhabi',
        type: 'Full-time',
        specialty: 'AI/ML',
        source: 'Company careers',
        url: 'https://presight.ai/careers/',
    },
    {
        id: 9,
        title: 'DevOps Engineer',
        company: 'Kitopi',
        location: 'Dubai',
        type: 'Full-time',
        specialty: 'DevOps',
        source: 'Company careers',
        url: 'https://www.kitopi.com/careers',
    },
    {
        id: 10,
        title: 'Software Engineering Intern',
        company: 'Amazon',
        location: 'Dubai',
        type: 'Internship',
        specialty: 'Software Engineering',
        source: 'Company careers',
        url: 'https://www.amazon.jobs/',
    },
]

export function buildFilterOptions(jobs){
    return {
        locations: [...new Set(jobs.map(job => job.location))].sort(),
        types: [...new Set(jobs.map(job => job.type))].sort(),
        specialties: [...new Set(jobs.map(job => job.specialty))].sort(),
    }
}

export function filterJobs(jobs, { query, location, type, specialty }){
    const normalizedQuery = query.trim().toLowerCase()
    const normalizedLocation = location.toLowerCase()
    const normalizedType = type.toLowerCase()
    const normalizedSpecialty = specialty.toLowerCase()

    return jobs.filter(job => {
        const searchableText = [
            job.title,
            job.company,
            job.location,
            job.type,
            job.specialty,
        ].join(' ').toLowerCase()

        return (
            (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
            (!normalizedLocation || job.location.toLowerCase() === normalizedLocation) &&
            (!normalizedType || job.type.toLowerCase() === normalizedType) &&
            (!normalizedSpecialty || job.specialty.toLowerCase() === normalizedSpecialty)
        )
    })
}
