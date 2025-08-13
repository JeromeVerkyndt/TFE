/**
 * @swagger
 * tags:
 *   - name: Transactions
 *     description: API pour gérer les transactions
 */

/**
 * @swagger
 * /transactions/user/{user_id}:
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
 * /transactions:
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
    const { user_id, amount, type, order_id, comment } = req.body;

    if (!user_id || !amount || !type) {
        return res.status(400).json({ error: "Champs requis manquants" });
    }

    const sql = `
        INSERT INTO transaction (user_id, amount, type, order_id, comment, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    `;

    req.db.query(
        sql,
        [user_id, amount, type, order_id || null, comment],
        (err, result) => {
            if (err) {
                console.error("Erreur lors de la création de la transaction :", err);
                return res.status(500).json({ error: "Erreur serveur" });
            }

            res.status(201).json({ id: result.insertId });
        }
    );
};


module.exports = {

    getTransactionByUserId,
    createTransaction
};
