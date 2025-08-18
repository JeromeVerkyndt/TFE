import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


function NavbarAdmin() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, { withCredentials: true });
            navigate('/login');
            window.location.reload();
        } catch (err) {
            console.error("Erreur lors de la déconnexion :", err);
        }
    };

    return (
        <nav className="navbar px-3 fixed-top navbar-dark" style={{ backgroundColor: '#14532d' }}>
            <Link className="navbar-brand text-white fw-bold d-flex align-items-center" to="/">
                <img
                    src="/images/panier_blanc.svg"
                    alt="Profil"
                    className="rounded-circle"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
                <span>Admin</span>
            </Link>
            <div>
                <Link className="text-white nav-link d-inline px-2" to="/">Accueil</Link>
                <Link className="text-white nav-link d-inline px-2" to="/create-product">Produit</Link>
                <Link className="text-white nav-link d-inline px-2" to="/create-inforamtion">News</Link>
                <Link className="text-white nav-link d-inline px-2" to="/stock">Stock</Link>
                <Link className="text-white nav-link d-inline px-2" to="/suivi-client">Client</Link>
                <Link className="text-white nav-link d-inline px-2" to="/create-subscription">Abonnement</Link>

                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm ms-3">
                    Déconnexion
                </button>
            </div>
        </nav>
    );
}

export default NavbarAdmin;
