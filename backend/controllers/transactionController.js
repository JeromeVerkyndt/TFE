/**
 * @swagger
 * tags:
 *   - name: Transactions
 *     description: API pour gérer les transactions
 */

/**
 * @swagger
 * /api/transaction/user/{user_id}:
 *   get:
 *     summary: Récupérer toutes les transactions d'un utilisateur
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID de l'utilisateur dont on veut récupérer les transactions
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Erreur serveur
 */
const getTransactionByUserId = (req, res) => {
    const { user_id } = req.params;
    const sql = `
        SELECT * FROM transaction
        WHERE user_id = ? AND deleted = FALSE
        ORDER BY created_at DESC
    `;
    req.db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching transaction by user_id:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json(results);
    });
};

/**
 * @swagger
 * /api/transaction/create:
 *   post:
 *     summary: Créer une nouvelle transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - amount
 *               - type
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID de l'utilisateur
 *               amount:
 *                 type: number
 *                 description: Montant de la transaction
 *               type:
 *                 type: string
 *                 description: Type de transaction
 *               order_id:
 *                 type: integer
 *                 description: ID de la commande associée (optionnel)
 *               comment:
 *                 type: string
 *                 description: Commentaire optionnel
 *     responses:
 *       201:
 *         description: Transaction créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *       400:
 *         description: Champs requis manquants
 *       500:
 *         description: Erreur serveur
 */
const createTransaction = (req, res) => {
    const { user_id, amount, type, order_id, comment, is_paid } = req.body;

    if (!user_id || !amount || !type) {
        return res.status(400).json({ error: "Champs requis manquants" });
    }

    const sql = `
        INSERT INTO transaction (user_id, amount, type, order_id, comment, created_at, is_paid)
        VALUES (?, ?, ?, ?, ?, NOW(), ?)
    `;

    req.db.query(
        sql,
        [user_id, amount, type, order_id || null, comment, is_paid],
        (err, result) => {
            if (err) {
                console.error("Erreur lors de la création de la transaction :", err);
                return res.status(500).json({ error: "Erreur serveur" });
            }

            res.status(201).json({ id: result.insertId });
        }
    );
};

/**
 * @swagger
 * /api/transaction/{id}/paid:
 *   put:
 *     summary: Mettre à jour le statut de paiement d'une transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la transaction à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - is_paid
 *             properties:
 *               is_paid:
 *                 type: boolean
 *                 description: Nouveau statut de paiement
 *     responses:
 *       200:
 *         description: Statut de paiement mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 id:
 *                   type: integer
 *       400:
 *         description: Champ requis manquant
 *       404:
 *         description: Transaction non trouvée
 *       500:
 *         description: Erreur serveur
 */

const updatePaidStatus = (req, res) => {
    const { id } = req.params;
    const { is_paid } = req.body;

    if (typeof is_paid === "undefined") {
        return res.status(400).json({ error: "Le champ is_paid est requis" });
    }

    const sql = "UPDATE transaction SET is_paid = ? WHERE id = ?";

    req.db.query(sql, [is_paid, id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la mise à jour du paiement :", err);
            return res.status(500).json({ error: "Erreur serveur" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Transaction non trouvée" });
        }

        res.json({ success: true, id });
    });
};


/**
 * @swagger
 * /api/transaction/paid-subscriptions/{userId}:
 *   get:
 *     summary: Récupérer le nombre d'abonnements non payés d'un utilisateur
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nombre d'abonnements non payés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paidCount:
 *                   type: integer
 *                   description: Nombre d'abonnements non payés
 *       500:
 *         description: Erreur serveur
 */
const getUnpaidSubscriptions = (req, res) => {
    const { userId } = req.params;

    const sql = `
        SELECT COUNT(*) AS paid_count
        FROM transaction
        WHERE user_id = ? AND type = 'Abonnement' AND is_paid = false
    `;

    req.db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération des transactions :", err);
            return res.status(500).json({ error: "Erreur serveur" });
        }

        res.json({ paidCount: results[0].paid_count });
    });
};


module.exports = {

    getTransactionByUserId,
    createTransaction,
    updatePaidStatus,
    getUnpaidSubscriptions
};
