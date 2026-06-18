function SearchBar({query, onQueryChange}){
    return (
        <input
        type="text"
        placeholder="Search Jobs..."
        value={query}
        onChange={e => onQueryChange(e.target.value)}
        />
    )
}

export default SearchBar