export const sampleJobs = [
    {
        id: 1,
        title: 'Software Engineer',
        company: 'Careem',
        location: 'Dubai',
        type: 'Full-time',
        specialty: 'Software Engineering',
        source: 'Curated seed',
        url: 'https://www.careem.com/careers/',
        description: 'Build product features, APIs, and reliable services for a regional technology platform.',
        skills: ['Python', 'Java', 'APIs', 'Distributed Systems'],
    },
    {
        id: 2,
        title: 'Frontend Developer',
        company: 'Noon',
        location: 'Dubai',
        type: 'Full-time',
        specialty: 'Frontend',
        source: 'Curated seed',
        url: 'https://www.noon.com/uae-en/careers/',
        description: 'Create customer-facing web experiences with modern JavaScript and component systems.',
        skills: ['JavaScript', 'React', 'CSS', 'Frontend'],
    },
    {
        id: 3,
        title: 'Backend Engineer',
        company: 'Talabat',
        location: 'Abu Dhabi',
        type: 'Full-time',
        specialty: 'Backend',
        source: 'Curated seed',
        url: 'https://www.talabat.com/uae/careers',
        description: 'Work on backend services, data models, integrations, and platform reliability.',
        skills: ['Python', 'Java', 'SQL', 'Microservices'],
    },
    {
        id: 4,
        title: 'Machine Learning Engineer',
        company: 'G42',
        location: 'Abu Dhabi',
        type: 'Full-time',
        specialty: 'AI/ML',
        source: 'Curated seed',
        url: 'https://www.g42.ai/careers',
        description: 'Build ML pipelines, evaluate models, and deploy AI systems for production use.',
        skills: ['Python', 'Machine Learning', 'PyTorch', 'MLOps'],
    },
    {
        id: 5,
        title: 'Data Engineer',
        company: 'Bayut',
        location: 'Dubai',
        type: 'Full-time',
        specialty: 'Data Engineering',
        source: 'Curated seed',
        url: 'https://www.bayut.com/careers/',
        description: 'Design data pipelines, analytics datasets, and reliable data workflows.',
        skills: ['Python', 'SQL', 'ETL', 'Airflow'],
    },
    {
        id: 6,
        title: 'AI Research Intern',
        company: 'Technology Innovation Institute',
        location: 'Abu Dhabi',
        type: 'Internship',
        specialty: 'AI/ML',
        source: 'Curated seed',
        url: 'https://www.tii.ae/careers',
        description: 'Support applied AI research, experiments, model evaluation, and technical reports.',
        skills: ['Python', 'Research', 'Machine Learning', 'Deep Learning'],
    },
    {
        id: 7,
        title: 'Cloud Software Engineer',
        company: 'Microsoft',
        location: 'Dubai',
        type: 'Full-time',
        specialty: 'Cloud',
        source: 'Curated seed',
        url: 'https://careers.microsoft.com/',
        description: 'Build cloud-native systems and help customers use scalable cloud infrastructure.',
        skills: ['Azure', 'Cloud', 'Kubernetes', 'DevOps'],
    },
    {
        id: 8,
        title: 'Computer Vision Engineer',
        company: 'Presight',
        location: 'Abu Dhabi',
        type: 'Full-time',
        specialty: 'AI/ML',
        source: 'Curated seed',
        url: 'https://presight.ai/careers/',
        description: 'Develop computer vision models and deploy AI capabilities for analytics products.',
        skills: ['Python', 'Computer Vision', 'OpenCV', 'PyTorch'],
    },
    {
        id: 9,
        title: 'DevOps Engineer',
        company: 'Kitopi',
        location: 'Dubai',
        type: 'Full-time',
        specialty: 'DevOps',
        source: 'Curated seed',
        url: 'https://www.kitopi.com/careers',
        description: 'Own CI/CD workflows, infrastructure automation, and production observability.',
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    },
    {
        id: 10,
        title: 'Software Engineering Intern',
        company: 'Amazon',
        location: 'Dubai',
        type: 'Internship',
        specialty: 'Software Engineering',
        source: 'Curated seed',
        url: 'https://www.amazon.jobs/',
        description: 'Join an engineering team as an intern and work on software delivery with mentors.',
        skills: ['Java', 'Python', 'Algorithms', 'Data Structures'],
    },
]

const skillTerms = [
    'python',
    'java',
    'javascript',
    'typescript',
    'react',
    'node',
    'fastapi',
    'django',
    'sql',
    'postgresql',
    'mysql',
    'mongodb',
    'aws',
    'azure',
    'gcp',
    'docker',
    'kubernetes',
    'ci/cd',
    'devops',
    'machine learning',
    'deep learning',
    'pytorch',
    'tensorflow',
    'nlp',
    'computer vision',
    'opencv',
    'data engineering',
    'airflow',
    'spark',
    'etl',
    'apis',
    'microservices',
    'distributed systems',
    'algorithms',
    'data structures',
]

const stopwords = new Set([
    'and',
    'the',
    'for',
    'with',
    'from',
    'this',
    'that',
    'you',
    'your',
    'are',
    'will',
    'job',
    'role',
    'work',
    'team',
    'uae',
    'dubai',
    'abu',
    'dhabi',
])

function getTokens(text){
    return new Set(
        text
            .toLowerCase()
            .match(/[a-zA-Z][a-zA-Z+#./-]{1,}/g)
            ?.filter(token => !stopwords.has(token) && token.length > 2) || []
    )
}

export function buildFilterOptions(jobs){
    return {
        locations: [...new Set(jobs.map(job => job.location))].sort(),
        types: [...new Set(jobs.map(job => job.type))].sort(),
        specialties: [...new Set(jobs.map(job => job.specialty))].sort(),
        sources: [...new Set(jobs.map(job => job.source))].sort(),
    }
}

export function filterJobs(jobs, { query, location, type, specialty, source }){
    const normalizedQuery = query.trim().toLowerCase()
    const normalizedLocation = location.toLowerCase()
    const normalizedType = type.toLowerCase()
    const normalizedSpecialty = specialty.toLowerCase()
    const normalizedSource = source.toLowerCase()

    return jobs.filter(job => {
        const searchableText = [
            job.title,
            job.company,
            job.location,
            job.type,
            job.specialty,
            job.source,
            job.description,
            ...(job.skills || []),
        ].join(' ').toLowerCase()

        return (
            (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
            (!normalizedLocation || job.location.toLowerCase() === normalizedLocation) &&
            (!normalizedType || job.type.toLowerCase() === normalizedType) &&
            (!normalizedSpecialty || job.specialty.toLowerCase() === normalizedSpecialty) &&
            (!normalizedSource || job.source.toLowerCase() === normalizedSource)
        )
    })
}

export function matchJobsToCv(cvText, jobs, limit = 6){
    const cv = cvText.trim()

    if (!cv) return []

    const cvLower = cv.toLowerCase()
    const cvTokens = getTokens(cv)
    const cvSkills = new Set(skillTerms.filter(skill => cvLower.includes(skill)))
    const wantsInternship = ['intern', 'internship', 'student', 'graduate', 'junior'].some(term =>
        cvLower.includes(term)
    )

    return jobs
        .map(job => {
            const jobText = [
                job.title,
                job.specialty,
                job.description,
                ...(job.skills || []),
            ].join(' ')
            const jobLower = jobText.toLowerCase()
            const jobTokens = getTokens(jobText)
            const jobSkills = new Set([
                ...(job.skills || []).map(skill => skill.toLowerCase()),
                ...skillTerms.filter(skill => jobLower.includes(skill)),
            ])
            const skillOverlap = [...cvSkills].filter(skill => jobSkills.has(skill))
            const tokenOverlap = [...cvTokens].filter(token => jobTokens.has(token))
            const skillScore = Math.min(skillOverlap.length / Math.max(jobSkills.size, 1), 1)
            const tokenScore = Math.min(tokenOverlap.length / 12, 1)
            const internshipScore = wantsInternship && job.type === 'Internship' ? 1 : 0.35
            const specialtyScore = cvLower.includes(job.specialty.toLowerCase()) ? 1 : 0.5
            const score = Math.round(skillScore * 55 + tokenScore * 25 + internshipScore * 10 + specialtyScore * 10)
            const reasons = []

            if (skillOverlap.length) {
                reasons.push(`Skills overlap: ${skillOverlap.slice(0, 5).join(', ')}`)
            }
            if (wantsInternship && job.type === 'Internship') {
                reasons.push('Internship fit')
            }
            if (job.specialty) {
                reasons.push(`${job.specialty} alignment`)
            }
            if (!reasons.length) {
                reasons.push('General software profile match')
            }

            return {
                job,
                score: Math.max(1, Math.min(score, 100)),
                matched_skills: skillOverlap,
                reasons: reasons.slice(0, 3),
            }
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
}
