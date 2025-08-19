# Web App de récupération de paniers


## Le site web déployé
Voici l'URL pour pouvoir accéder au site web 
* https://front-production-3aaf.up.railway.app/

Les identifiants pour se connecter sont des Annexes du rapport.

## Comment lancer le projet

### Prérequis

Assurez-vous d'avoir installé Node.js et npm sur votre système. Vous pouvez les télécharger et les installer à partir du site officiel [Node.js](https://nodejs.org/).

### Étapes pour lancer le frontend (React)

1. Clonez ce dépôt GitHub sur votre machine locale :

    ```bash
    git clone https://github.com/JeromeVerkyndt/TFE.git
    ```

2. Accédez au répertoire du projet :

    ```bash
    cd /frontend
    ```

3. Installez les dépendances nécessaires :

    ```bash
    npm install
    ```

4. Lancez l'application frontend :

    ```bash
    npm run dev
    ```


### Étapes pour lancer le backend (Node.js)

1. Accédez au répertoire backend du projet :

    ```bash
    cd ../backend
    ```

2. Installez les dépendances nécessaires :

    ```bash
    npm install
    ```

3. Configurez votre base de données avec le script SQL dans /DB et en modifiant le fichier `.env` avec vos paramètres de base de données.

4. Lancez le serveur backend :

    ```bash
    npm run dev
    ```

## Configuration


### `frontend/.env` 
```env
VITE_API_URL= url_du_backend
```

### `backend/.env` 
```env
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

FRONTEND_URL=
BACKEND_PORT=

RESEND_API_KEY=
```