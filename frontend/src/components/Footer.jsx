import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer
            className="py-3 mt-5"
            style={{
                backgroundColor: '#14532d',
                color: 'white',
                width: '100vw',        // occupe toute la largeur de l'écran
                marginLeft: 'calc(-50vw + 50%)' // enlève le décalage dû au body/container
            }}
        >
            <div className="text-center">
                <p className="mb-1">© 2025 Panier. Tous droits réservés.</p>
                <p className="mb-1">
                    <a
                        href="jerome.verkyndt@gmail.com"
                        className="text-white text-decoration-none"
                    >
                        jerome.verkyndt@gmail.com
                    </a>
                </p>
                <p className="mb-0">
                    <Link
                        to="/confidentialite"
                        className="text-white text-decoration-none"
                    >
                        Confidentialité des données
                    </Link>
                </p>
            </div>
        </footer>
    );
}

export default Footer;
