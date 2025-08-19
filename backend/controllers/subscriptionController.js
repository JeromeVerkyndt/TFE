/**
 * @swagger
 * tags:
 *   name: Subscription
 *   description: API pour gérer les abonnements
 */

/**
 * @swagger
 * /api/subscriptions/add:
 *   post:
 *     summary: Créer un nouvel abonnement
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *             required:
 *               - name
 *               - price
 *     responses:
 *       201:
 *         description: Abonnement créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: integer
 *       500:
 *         description: Erreur serveur
 */
const createSubscription = (req, res) => {
    const { name, description, price } = req.body;
    if (!name || price === undefined) {
        return res.status(400).json({ error: 'nom et prix requis' });
    }

    const sql = `
        INSERT INTO subscription (name, description, price, created_at, deleted, visible)
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

/**
 * @swagger
 * /api/subscriptions/all:
 *   get:
 *     summary: Récupérer tous les abonnements non supprimés
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         description: Liste des abonnements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Erreur serveur
 */
const getAllSubscriptions = async (req, res) => {
    const sql = `SELECT * FROM subscription WHERE deleted = FALSE`;

    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des abonnement :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.status(200).json(results);
        }
    });
};

/**
 * @swagger
 * /api/subscriptions{id}:
 *   delete:
 *     summary: Supprimer un abonnement (soft delete)
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'abonnement à supprimer
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Abonnement supprimé (soft delete)
 *       404:
 *         description: Abonnement non trouvé
 *       500:
 *         description: Erreur serveur
 */
const softDeleteSubscription = (req, res) => {
    const { id } = req.params;

    const sql = `
        UPDATE subscription 
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

/**
 * @swagger
 * /api/subscriptions/visibility/{id}:
 *   patch:
 *     summary: Mettre à jour la visibilité d'un abonnement
 *     tags: [Subscription]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'abonnement
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visible:
 *                 type: boolean
 *             required:
 *               - visible
 *     responses:
 *       200:
 *         description: Visibilité mise à jour
 *       404:
 *         description: Abonnement non trouvé ou supprimé
 *       500:
 *         description: Erreur serveur
 */
const updateSubscriptionVisibility = (req, res) => {
    const { id } = req.params;
    const { visible } = req.body;
    if (visible === undefined) {
        return res.status(400).json({ error: 'visible requis' });
    }

    const sql = `
        UPDATE subscription
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

/**
 * @swagger
 * /api/subscriptions/user:
 *   get:
 *     summary: Récupérer l' abonnement d'un utilisateur selon son ID
 *     tags: [Subscription]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Abonnements de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: userId requis
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
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
            sql = 'SELECT * FROM subscription WHERE visible = true AND deleted = false';
            params = [];
        } else {
            sql = 'SELECT * FROM subscription WHERE id = ? AND deleted = false';
            params = [subscriptionId];
        }

        req.db.query(sql, params, (err, subscription) => {
            if (err) {
                console.error("Erreur lors de la récupération des abonnements :", err);
                return res.status(500).json({ error: 'Erreur serveur' });
            }

            return res.status(200).json(subscription);
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