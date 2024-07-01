const { useState, useEffect } = React
const { Link, useParams ,useNavigate} = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'


export function BugDetails() {
    const navigate = useNavigate()
    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => {
                setBug(bug)
            })
            .catch(err => {
                showErrorMsg('Wait for a bit')
                navigate('/bug')
            })
    }, [])

    if (!bug) return <h1>loadings....</h1>
    return bug && <div>
        <h3>Bug Details 🐛</h3>
        <h4>{bug.title}</h4>
        <h4>Description:</h4>
        <h3>{bug.description}</h3>
        <p>Severity: <span>{bug.severity}</span></p>
        <Link to="/bug">Back to List</Link>
    </div>

}

