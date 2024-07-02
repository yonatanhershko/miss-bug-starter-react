import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function BugFilter({ filterBy, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy, sortBy: '', sortDir: 'asc' })

    const sorts = [
        { display: 'Title', filter: 'title' },
        { display: 'Severity', filter: 'severity' },
        { display: 'Created At', filter: 'createdAt' }
    ]

    useEffect(() => {
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        if (field.startsWith('labels-')) {
            const label = field.split('labels-')[1]
            value = target.checked ? [...filterByToEdit.labels, label] : filterByToEdit.labels.filter(l => l !== label)
            setFilterByToEdit(prevFilter => ({ ...prevFilter, labels: value }))
        } else {
            setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
        }
    }

    function onSortChange(sortBy) {
        const sortDir = filterByToEdit.sortBy === sortBy && filterByToEdit.sortDir === 'asc' ? 'desc' : 'asc'
        setFilterByToEdit(prevFilter => ({ ...prevFilter, sortBy, sortDir }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    const { title, severity, labels, sortBy, sortDir } = filterByToEdit

    return (
        <section className="bug-filter">
            <h2>Filter Our Bugs</h2>

            <form onSubmit={onSubmitFilter}>
                <section className="filter-search-bars">
                    <label htmlFor="title">Title</label>
                    <input value={title} onChange={handleChange} name="title" type="text" id="title" />

                    <label htmlFor="severity">Severity</label>
                    <input value={severity || ''} onChange={handleChange} name="severity" type="number" id="severity" />
                </section>
                <div className="labels-container">
                    <label>Labels</label>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                name="labels-critical"
                                checked={labels.includes("critical")}
                                onChange={handleChange}
                            />
                            Critical
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="labels-need-CR"
                                checked={labels.includes("need-CR")}
                                onChange={handleChange}
                            />
                            Need-CR
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="labels-dev-branch"
                                checked={labels.includes("dev-branch")}
                                onChange={handleChange}
                            />
                            Dev-Branch
                        </label>
                    </div>
                </div>

                <div className="note-filter-type">
                    {sorts.map((sortOption) => (
                        <p
                            className={sortBy === sortOption.filter ? 'active' : ''}
                            key={sortOption.display}
                            onClick={() => onSortChange(sortOption.filter)}
                        >
                            {sortOption.display} {sortBy === sortOption.filter ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                        </p>
                    ))}
                </div>

                <button>Submit</button>
            </form>
        </section>
    )
}
