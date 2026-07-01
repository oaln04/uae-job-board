function SearchBar({
    query,
    onQueryChange,
    selectedLocation,
    onLocationChange,
    selectedType,
    onTypeChange,
    selectedSpecialty,
    onSpecialtyChange,
    filters,
    onClear,
    hasActiveFilters,
}){
    return (
        <section className="search-panel" aria-label="Search and filters">
            <label className="search-field">
                <span>Search</span>
                <input
                    type="search"
                    placeholder="Title, company, skill, or city"
                    value={query}
                    onChange={e => onQueryChange(e.target.value)}
                />
            </label>

            <div className="filters-row">
                <label>
                    <span>Location</span>
                    <select value={selectedLocation} onChange={e => onLocationChange(e.target.value)}>
                        <option value="">All locations</option>
                        {filters.locations.map(location => (
                            <option key={location} value={location}>{location}</option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Type</span>
                    <select value={selectedType} onChange={e => onTypeChange(e.target.value)}>
                        <option value="">All types</option>
                        {filters.types.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Specialty</span>
                    <select value={selectedSpecialty} onChange={e => onSpecialtyChange(e.target.value)}>
                        <option value="">All specialties</option>
                        {filters.specialties.map(specialty => (
                            <option key={specialty} value={specialty}>{specialty}</option>
                        ))}
                    </select>
                </label>

                <button type="button" onClick={onClear} disabled={!hasActiveFilters}>
                    Clear
                </button>
            </div>
        </section>
    )
}

export default SearchBar
