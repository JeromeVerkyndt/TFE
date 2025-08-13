// backend/server.js
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




// Exemple de route API
//app.get('/api/users', (req, res) => {
    //db.query('SELECT * FROM users', (err, results) => {
        //if (err) {
//return res.status(500).json({ error: 'Erreur serveur' });
//}
//res.json(results);
//});
//});

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


// Démarrer le serveur
app.listen(port, () => {
    console.log(`Backend en cours d'exécution sur http://localhost:${port}`);
});
