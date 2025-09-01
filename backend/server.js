require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');
const cookieParser = require('cookie-parser');
const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');
const newsRoutes = require('./routes/newsRoutes');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const uploadRoutes = require("./routes/upload");
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const mailRoutes = require('./routes/mailRoutes');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cron = require('node-cron');
const axios = require('axios');

const app = express();
const port = process.env.BACKEND_PORT;


app.use(cookieParser());


app.use(cors({
    origin: process.env.FRONTEND_URL,  // ton frontend
    credentials: true                // autorise l'envoi de cookies/headers auth
}));

// backend/server.js
app.use(express.json());  // Pour parser le corps de la requête en JSON
app.use(express.urlencoded({ extended: true }));  // Pour parser les données URL-encodées


// Connexion à la base de données
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Conf Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0', // version OpenAPI
        info: {
            title: 'API de mon site',
            version: '1.0.0',
            description: 'Documentation des endpoints de mon site',
        },
        servers: [
            {
                url: `http://localhost:${port}`, // ton URL backend
            },
        ],
    },
    apis: ['./controllers/*.js'], // chemin vers tes fichiers avec la doc
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);



// Partage la connexion à la DB dans req.db
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/order-item', orderItemRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transaction', transactionRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/mail", mailRoutes);

// Route doc swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// reset mensuel de l'abonnement 'min h j * *'
cron.schedule('30 9 1 * *', async () => {
    console.log(' Lancement de la mise à jour automatique des soldes via API...');

    try {
        const response = await axios.put(`http://localhost:${port}/api/user/all-balance/reset-subscription`);
        console.log(` ${response.data.message} (${response.data.affectedRows} clients mis à jour)`);
    } catch (error) {
        console.error(' Erreur lors de l’appel API :', error.response?.data || error.message);
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Backend en cours d'exécution sur http://localhost:${port}`);
    console.log(`Swagger dispo sur http://localhost:${port}/api-docs`);
});
