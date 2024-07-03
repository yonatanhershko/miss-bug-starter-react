const { useState, useEffect } = React
const { Link, useParams ,useNavigate} = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { userService } from '../services/user.service.js'

export function UserDetails() {
    const { userId } = useParams()
    const [user, setUser] = useState(null)
    const [userBugs, setUserBugs] = useState([])

    useEffect(() => {
        console.log('UserId', userId)
        loadUser()
        loadUserBugs()
    }, [userId])

    function loadUser() {
        userService.getById(userId).then(user => {
            console.log('Fetched user:', user)
            setUser(user)
        }).catch(err => {
            console.error('Error fetching user:', err)
        })
    }

    function loadUserBugs() {
        bugService.query({ creator: userId }).then(bugs => {
            console.log('Fetched bugs:', bugs)
            setUserBugs(bugs)
        }).catch(err => {
            console.error('Error fetching bugs:', err)
        })
    }

    if (!user) return <div>Loading...</div>

    return (
        <div>
            <h1>{user.fullname}'s Profile</h1>
            <h2>Bugs Created by {user.fullname}</h2>
            <BugList bugs={userBugs} showActions={false} />
        </div>
    )
}
