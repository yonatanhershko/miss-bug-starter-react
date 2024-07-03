const { NavLink, Link } = ReactRouterDOM
const { useEffect, useState } = React
const { useNavigate } = ReactRouter

import { userService } from '../services/user.service.js'
import { LoginSignup } from './LoginSignup.jsx'
import { UserMsg } from './UserMsg.jsx'

export function AppHeader() {
    const navigate = useNavigate()
    const [user, setUser] = useState(userService.getLoggedinUser())

    function onLogout() {
        userService.logout()
            .then(() => onSetUser(null))
            .catch(err => showErrorMsg('OOPs try again'))
    }

    function onSetUser(user) {
        setUser(user)
        navigate('/')
    }

    return (
        <header className='container'>
            <nav>
                <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
                <NavLink to="/about">About</NavLink>
            </nav>
            <h1>Bugs are Forever</h1>
            {user ? (
                <section>
                    <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
                    <button onClick={onLogout}>Logout</button>
                </section>
            ) : (
                <section>
                    <LoginSignup onSetUser={onSetUser} />
                </section>
            )}

            <UserMsg />
        </header>
    )
}
