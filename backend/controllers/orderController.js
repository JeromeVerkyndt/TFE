/**
 * @swagger
 * tags:
 *   name: Order
 *   description: API pour gérer les commandes
 */
/**
 * @swagger
 * /api/order/create:
 *   post:
 *     summary: Crée une nouvelle commande
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *       500:
 *         description: Erreur serveur
 */
const createOrder = (req, res) => {
    const { user_id } = req.body;
    if (user_id === undefined || user_id === null) {
        return res.status(400).json({ error: 'user_id est requis' });
    }
    const sql = `
        INSERT INTO order (user_id, created_at)
        VALUES (?, NOW())
    `;
    req.db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error('Error creating order:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(201).json({ message: 'Order created successfully', id: result.insertId });
    });
};

/**
 * @swagger
 * /api/order/{id}:
 *   delete:
 *     summary: Supprime une commande (soft delete)
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la commande à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Commande supprimée avec succès
 *       500:
 *         description: Erreur serveur
 */
const softDeleteOrder = (req, res) => {
    const { id } = req.params;
    const sql = `
        UPDATE order
        SET deleted = TRUE, deleted_at = NOW()
        WHERE id = ?
    `;
    req.db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error soft deleting order:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json({ message: 'Order soft deleted successfully' });
    });
};

/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Récupère toutes les commandes non supprimées
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Liste des commandes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Erreur serveur
 */
const getAllOrders = (req, res) => {
    const sql = `SELECT * FROM order WHERE deleted = FALSE`;
    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json(results);
    });
};

/**
 * @swagger
 * /api/order/{id}:
 *   get:
 *     summary: Récupère une commande avec sont ID
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la commande
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la commande
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
const getOrderById = (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT * FROM order
        WHERE id = ? AND deleted = FALSE
    `;
    req.db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error fetching order by id:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(results[0]);
    });
};

/**
 * @swagger
 * /api/order/user/{user_id}:
 *   get:
 *     summary: Récupère toutes les commandes d’un utilisateur
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID de l’utilisateur
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des commandes de l’utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Erreur serveur
 */
const getOrdersByUserId = (req, res) => {
    const { user_id } = req.params;
    const sql = `
        SELECT * FROM order
        WHERE user_id = ? AND deleted = FALSE
    `;
    req.db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching orders by user_id:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json(results);
    });
};

module.exports = {
    createOrder,
    softDeleteOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId
};
