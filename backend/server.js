// backend/server.js
const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');
const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');
const newsRoutes = require('./routes/newsRoutes');



const app = express();
const port = 5001;

app.use(cors());

// backend/server.js
app.use(express.json());  // Pour parser le corps de la requête en JSON
app.use(express.urlencoded({ extended: true }));  // Pour parser les données URL-encodées


// Connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Test1234',  
    database: 'tfe_panier'
});

db.connect(err => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
    } else {
        console.log('Connecté à la base de données MySQL');
    }
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
app.use('/api/order_item', orderItemRoutes);
app.use('/api/news', newsRoutes);


// Démarrer le serveur
app.listen(port, () => {
    console.log(`Backend en cours d'exécution sur http://localhost:${port}`);
});
