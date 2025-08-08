const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');


// Inscription
router.post('/register', async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    if (!email || !password || !first_name || !last_name)
        return res.status(400).json({ error: 'Tous les champs sont requis' });

    try {
        const hashed = await bcrypt.hash(password, 10);
        req.db.query(
            'INSERT INTO user (email, password, first_name, last_name, status_id) VALUES (?, ?, ?, ?, ?)',
            [email, hashed, first_name, last_name, 2],
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


// Connexion
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    req.db.query(
        `SELECT user.*, user_status.name AS status_name
         FROM user
         JOIN user_status ON user.status_id = user_status.id
         WHERE user.email = ?`,
        [email],
        async (err, results) => {
        if (err || results.length === 0)
            return res.status(401).json({ error: 'Email incorrect' });

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Mot de passe incorrect' });

        const token = jwt.sign({ id: user.id, role: user.status_name }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // true en production avec HTTPS
            sameSite: 'None',
            maxAge: 2 * 60 * 60 * 1000,
        });

        res.json({ message: 'Connecté' });
    });
});

// Déconnexion
router.post('/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'Déconnecté' });
});

// test la connexion
router.get('/me', authMiddleware, (req, res) => {
    req.db.query(
        `SELECT user.id, user.email, user.first_name, user.last_name, user_status.name AS role
         FROM user 
         JOIN user_status ON user.status_id = user_status.id
         WHERE user.id = ?`,
        [req.user.id],
        (err, results) => {
            if (err || results.length === 0) return res.sendStatus(401);
            const user = results[0];
            res.json({ user });
        }
    );
});

// Changer le mot de passe
router.put('/change-password', authMiddleware, async (req, res) => {
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ error: 'Le nouveau mot de passe est requis' });
    }

    try {
        const hashed = await bcrypt.hash(newPassword, 10);
        req.db.query('UPDATE user SET password = ? WHERE id = ?', [hashed, req.user.id], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erreur lors de la mise à jour du mot de passe' });
            }
            res.json({ message: 'Mot de passe changé avec succès' });
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});





module.exports = router;
