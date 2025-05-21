import { Link } from 'react-router-dom';

function HubNavbar() {
    return (
        <nav className="navbar bg-light px-3 fixed-top">
            <Link className="navbar-brand" to="/">Hub</Link>
            <div>
                <Link className="nav-link d-inline px-2" to="/user-selecte">Liste Mangeur</Link>
            </div>
        </nav>
    );
}

export default HubNavbar;