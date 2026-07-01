function CvMatcher({
    cvText,
    onCvTextChange,
    onMatch,
    onClear,
    isMatching,
    matchError,
    matchCount,
    hasMatches,
}){
    return (
        <section className="matcher-panel" aria-label="CV matcher">
            <label>
                <span>CV</span>
                <textarea
                    value={cvText}
                    onChange={event => onCvTextChange(event.target.value)}
                    placeholder="Paste CV text, skills, projects, or experience"
                    rows="7"
                />
            </label>

            <div className="matcher-actions">
                <button type="button" onClick={onMatch} disabled={isMatching || cvText.trim().length < 20}>
                    {isMatching ? 'Matching...' : 'Match CV'}
                </button>
                <button type="button" className="secondary-button" onClick={onClear} disabled={!cvText && !hasMatches}>
                    Clear match
                </button>
            </div>

            {matchError && <p className="matcher-message error">{matchError}</p>}
            {hasMatches && !matchError && (
                <p className="matcher-message">{matchCount} ranked matches found</p>
            )}
        </section>
    )
}

export default CvMatcher
