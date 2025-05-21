const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');


// 🔐 Inscription
router.post('/register', async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    if (!email || !password || !first_name || !last_name)
        return res.status(400).json({ error: 'Tous les champs sont requis' });

    try {
        const hashed = await bcrypt.hash(password, 10);
        req.db.query(
            'INSERT INTO user (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
            [email, hashed, first_name, last_name],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Erreur création compte' });
                }
                res.status(201).json({ message: 'Compte créé' });
            }
        );
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


// 🔐 Connexion
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    req.db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0)
            return res.status(401).json({ error: 'Email incorrect' });

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Mot de passe incorrect' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // true en production avec HTTPS
            sameSite: 'lax',
            maxAge: 2 * 60 * 60 * 1000,
        });

        res.json({ message: 'Connecté' });
    });
});

// 🔓 Déconnexion
router.post('/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'Déconnecté' });
});

// Route protégée pour tester la connexion
router.get('/me', authMiddleware, (req, res) => {
    res.json({ message: 'Tu es connecté', user: req.user });
});


module.exports = router;
