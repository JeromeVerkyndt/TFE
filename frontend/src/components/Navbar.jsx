import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar bg-light px-3 fixed-top">
            <Link className="navbar-brand" to="/">MonSite</Link>
            <div>
                <Link className="nav-link d-inline px-2" to="/">Accueil</Link>
                <Link className="nav-link d-inline px-2" to="/test">Test</Link>
                <Link className="nav-link d-inline px-2" to="/produits">Magasin</Link>
                <Link className="nav-link d-inline px-2" to="/create-product">Ajouter Produit</Link>
                <Link className="nav-link d-inline px-2" to="/create-inforamtion">Editer News</Link>
            </div>
        </nav>
    );
}

export default Navbar;
