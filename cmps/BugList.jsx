const { Link } = ReactRouterDOM;
import { userService } from "../services/user.service.js";
import { BugPreview } from './BugPreview.jsx';

export function BugList({ bugs, onRemoveBug, onEditBug, showActions = true }) {
    const user = userService.getLoggedinUser();

    function isOwner(bug) {
        if (!user) return false;
        if (!bug.creator) return true;
        return user.isAdmin || bug.creator._id === user._id;
    }

    if (!bugs) return <div>Loading...</div>;
    
    return (
        <ul className="bug-list">
            {bugs.map((bug) => (
                <li className="bug-preview" key={bug._id}>
                    <BugPreview bug={bug} />
                    <Link to={`/bug/${bug._id}`}>Details</Link>
                    {showActions && isOwner(bug) && (
                        <div>
                            <button onClick={() => onRemoveBug(bug._id)}>x</button>
                            <button onClick={() => onEditBug(bug)}>Edit</button>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
}
