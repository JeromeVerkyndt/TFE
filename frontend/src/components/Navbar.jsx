import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout', {}, { withCredentials: true });
            navigate('/login'); // Redirige vers la page de login
        } catch (err) {
            console.error("Erreur lors de la déconnexion :", err);
        }
    };

    return (
        <nav className="navbar bg-light px-3 fixed-top">
            <Link className="navbar-brand" to="/">MonSite</Link>
            <div>
                <Link className="nav-link d-inline px-2" to="/">Accueil</Link>
                <Link className="nav-link d-inline px-2" to="/test">Test</Link>
                <Link className="nav-link d-inline px-2" to="/produits">Magasin</Link>
                <Link className="nav-link d-inline px-2" to="/create-product">Ajouter Produit</Link>
                <Link className="nav-link d-inline px-2" to="/create-inforamtion">Editer News</Link>
                <Link className="nav-link d-inline px-2" to="/stock">Stock</Link>
                <Link className="nav-link d-inline px-2" to="/suivi-client">Client</Link>

                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm ms-3">
                    Déconnexion
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
