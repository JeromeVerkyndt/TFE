import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function NavbarHub() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, { withCredentials: true });
            navigate('/login');
        } catch (err) {
            console.error("Erreur lors de la déconnexion :", err);
        }
    };

    return (
        <nav className="navbar px-3 fixed-top navbar-dark" style={{ backgroundColor: '#14532d' }}>
            <Link className="navbar-brand" to="/">Click & Collect</Link>
            <div>
                <Link className="text-white nav-link d-inline px-2" to="/">Accueil</Link>
                <Link className="text-white nav-link d-inline px-2" to="/hub/user-selecte">Selection</Link>
                <Link className="text-white nav-link d-inline px-2" to="/hub/panier">Panier</Link>


                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm ms-3">
                    Déconnexion
                </button>
            </div>
        </nav>
    );
}

export default NavbarHub;
