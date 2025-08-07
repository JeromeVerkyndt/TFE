
const createSubscription = (req, res) => {
    const { name, description, price } = req.body;

    const sql = `
        INSERT INTO subscriptions (name, description, price, created_at, deleted, visible)
        VALUES (?, ?, ?, NOW(), false, false)
    `;

    req.db.query(sql, [name, description, price], (err, result) => {
        if (err) {
            console.error('Erreur lors de la création de l’abonnement :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        res.status(201).json({ message: 'Abonnement créé', id: result.insertId });
    });
};

const getAllSubscriptions = async (req, res) => {
    const sql = `SELECT * FROM subscriptions WHERE deleted = FALSE`;

    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des abonnement :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.status(200).json(results);
        }
    });
};

const softDeleteSubscription = (req, res) => {
    const { id } = req.params;

    const sql = `
        UPDATE subscriptions 
        SET deleted = true, deleted_at = NOW()
        WHERE id = ?
    `;

    req.db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression de l’abonnement :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Abonnement non trouvé' });
        }

        res.status(200).json({ message: 'Abonnement supprimé (soft delete)' });
    });
};

const updateSubscriptionVisibility = (req, res) => {
    const { id } = req.params;
    const { visible } = req.body;

    const sql = `
        UPDATE subscriptions
        SET visible = ?
        WHERE id = ? AND deleted = false
    `;

    req.db.query(sql, [visible ? 1 : 0, id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour de la visibilité :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Abonnement non trouvé ou supprimé' });
        }

        res.status(200).json({ message: 'Visibilité mise à jour' });
    });
};

const getUserSubscriptions = (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ error: 'userId requis en paramètre' });
    }

    const getUserSql = 'SELECT subscription_id FROM user WHERE id = ?';

    req.db.query(getUserSql, [userId], (err, userResult) => {
        if (err) {
            console.error("Erreur lors de la récupération du user :", err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (userResult.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const subscriptionId = userResult[0].subscription_id;

        let sql;
        let params;

        if (subscriptionId === null) {
            sql = 'SELECT * FROM subscriptions WHERE visible = true AND deleted = false';
            params = [];
        } else {
            sql = 'SELECT * FROM subscriptions WHERE id = ? AND deleted = false';
            params = [subscriptionId];
        }

        req.db.query(sql, params, (err, subscriptions) => {
            if (err) {
                console.error("Erreur lors de la récupération des abonnements :", err);
                return res.status(500).json({ error: 'Erreur serveur' });
            }

            return res.status(200).json(subscriptions);
        });
    });
};




module.exports = {
    getAllSubscriptions,
    createSubscription,
    softDeleteSubscription,
    updateSubscriptionVisibility,
    getUserSubscriptions
}