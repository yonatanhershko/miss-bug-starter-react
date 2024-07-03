

export function BugPreview({ bug }) {
    return (
        <article>
            <h4>{bug.title}</h4>
            <h1>🐛</h1>
            <p>Severity: <span>{bug.severity}</span></p>
            {bug.creator && 
                <h4>
                    Creator: <Link to={`/user/${bug.creator._id}`}>{bug.creator.fullname}</Link>
                </h4>
            }
        </article>
    )
}