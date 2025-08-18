function Confidentialite() {
    return (
        <div className="container py-5" style={{ maxWidth: "800px" }}>
            <h1 className="mb-4">Confidentialité des données</h1>

            <p>
                Cette application web est utilisée uniquement dans le cadre de la gestion et récupération
                des paniers de légumes.
            </p>

            <h2>Données collectées</h2>
            <p>Nous collectons uniquement les données nécessaires à la gestion des paniers, comme :</p>
            <ul>
                <li>Nom et prénom</li>
                <li>Adresse e-mail</li>
                <li>Historique des retraits de paniers</li>
            </ul>

            <h2>Utilisation des données</h2>
            <p>Ces données sont utilisées uniquement pour :</p>
            <ul>
                <li>Gérer la distribution des paniers</li>
                <li>Suivre qui a retiré son panier</li>
                <li>Améliorer l’organisation</li>
            </ul>

            <h2>Conservation et sécurité</h2>
            <p>
                Les données sont stockées de manière sécurisée et ne sont accessibles
                qu’à l'administrateur. Elles ne sont partagées avec aucun tiers.
            </p>

            <h2>Vos droits</h2>
            <p>
                Conformément au RGPD, vous pouvez demander à consulter, corriger ou
                supprimer vos données à tout moment en contactant :
            </p>
            <p><strong>Email :</strong> jerome.verkyndt@gmail.com</p>

            <h2>Contact</h2>
            <p>
                Pour toute question concernant la confidentialité de vos données,
                vous pouvez nous écrire à l’adresse ci-dessus.
            </p>
        </div>
    );
}

export default Confidentialite;
