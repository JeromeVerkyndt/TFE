const express = require('express');
const router = express.Router();
const generateUserReport = require('../emails/userBalanceReport');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/send-mail', async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "ID utilisateur manquant" });

    try {
        req.db.query('SELECT * FROM user WHERE id = ?', [userId], async (err, results) => {
            if (err) return res.status(500).json({ message: "Erreur DB" });
            if (results.length === 0) return res.status(404).json({ message: "Utilisateur introuvable" });

            const user = results[0];

            const { subject, text, html } = generateUserReport(user);

            await resend.emails.send({
                from: "Acme <onboarding@resend.dev>",
                to: user.email,
                subject,
                text,
                html
            });

            res.json({ message: "Mail envoyé !" });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'envoi du mail" });
    }
});

module.exports = router;
