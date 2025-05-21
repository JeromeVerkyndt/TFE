// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Non autorisé. Token manquant.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // disponible dans les routes protégées
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token invalide' });
    }
}

module.exports = authMiddleware;

