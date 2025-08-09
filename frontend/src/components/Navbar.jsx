import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import React from "react";

function Navbar() {
    const navigate = useNavigate();
    const { user } = useAuth();

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
        <nav
            className="navbar px-3 py-2 fixed-top d-flex justify-content-between align-items-center"
            style={{ backgroundColor: '#14532d' }}
        >
            <Link className="navbar-brand text-white fw-bold d-flex align-items-center" to="/">
                <img
                    src="/images/panier_blanc.svg"
                    alt="Profil"
                    className="rounded-circle"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
            </Link>

            <div className="d-flex align-items-center gap-2">
                <div className="dropdown">
                    <button
                        className="btn btn-sm btn-light dropdown-toggle"
                        type="button"
                        id="menuDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        ☰ Menu
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="menuDropdown">
                        <li><Link className="dropdown-item" to="/">Accueil</Link></li>
                        <li><Link className="dropdown-item" to="/news">News</Link></li>
                        <li><Link className="dropdown-item" to="/subscription">Abonnement</Link></li>
                    </ul>
                </div>

                <div className="dropdown">
                    <button
                        className="btn btn-sm btn-light dropdown-toggle"
                        type="button"
                        id="menuDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="bi bi-person"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="menuDropdown">
                        <li><Link className="dropdown-item" to="/compte">Compte</Link></li>
                        <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                        <li><Link onClick={handleLogout} className="dropdown-item text-danger">Déconnexion</Link></li>

                    </ul>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;
