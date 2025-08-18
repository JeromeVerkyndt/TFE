/**
 * @swagger
 * tags:
 *   name: Order item
 *   description: API pour gérer les item des transaction
 */
/**
 * @swagger
 * /api/order-item/create:
 *   post:
 *     summary: Crée un nouvel item d'une commande
 *     tags: [Order item]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: integer
 *                 example: 1
 *               product_id:
 *                 type: integer
 *                 example: 5
 *               quantity:
 *                 type: integer
 *                 example: 3
 *               promo:
 *                 type: number
 *                 example: 0
 *               price:
 *                 type: number
 *                 example: 10.99
 *               included_in_subscription:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: item de commande créé
 *       500:
 *         description: Erreur serveur
 */
const createOrderItem = (req, res) => {
    let { order_id, product_id, quantity, promo, price, included_in_subscription } = req.body;
    if (promo === undefined || promo === null || promo === '') {
        promo = 0;
    }
    const sql = `
        INSERT INTO order_item (order_id, product_id, quantity, promo, created_at, price, included_in_subscription)
        VALUES (?, ?, ?, ?, NOW(), ?, ?)
    `;
    req.db.query(sql, [order_id, product_id, quantity, promo, price, included_in_subscription], (err, result) => {
        if (err) {
            console.error('Error creating order_item:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(201).json({ message: 'Order item created successfully', id: result.insertId });
    });
};

/**
 * @swagger
 * /api/order-item/{id}:
 *   delete:
 *     summary: Supprime un item d'une commande (soft delete)
 *     tags: [Order item]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'item à supprimer
 *     responses:
 *       200:
 *         description: Item supprimé avec succès
 *       500:
 *         description: Erreur serveur
 */
const softDeleteOrderItem = (req, res) => {
    const { id } = req.params;
    const sql = `
        UPDATE order_item
        SET deleted = TRUE, deleted_at = NOW()
        WHERE id = ?
    `;
    req.db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error soft deleting order_item:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json({ message: 'Order item soft deleted successfully' });
    });
};

/**
 * @swagger
 * /api/order-item:
 *   get:
 *     summary: Récupère tous les items de commande non supprimés
 *     tags: [Order item]
 *     responses:
 *       200:
 *         description: Liste des items de commande
 *       500:
 *         description: Erreur serveur
 */
const getAllOrderItems = (req, res) => {
    const sql = `SELECT * FROM order_item WHERE deleted = FALSE`;
    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching order_items:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json(results);
    });
};

/**
 * @swagger
 * /api/order-item/order/{order_id}:
 *   get:
 *     summary: Récupère tous les items d'une commande spécifique avec les info produit en plus
 *     tags: [Order item]
 *     parameters:
 *       - in: path
 *         name: order_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Liste des items de la commande
 *       500:
 *         description: Erreur serveur
 */
const getOrderItemsByOrderId = (req, res) => {
    const { order_id } = req.params;
    const sql = `
        SELECT order_item.*, product.name AS name, product.description As description, product.unit As unit
        FROM order_item
        JOIN product ON order_item.product_id = product.id
        WHERE order_id = ? AND order_item.deleted = FALSE
    `;
    req.db.query(sql, [order_id], (err, results) => {
        if (err) {
            console.error('Error fetching order_items by order_id:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json(results);
    });
};

module.exports = {
    createOrderItem,
    softDeleteOrderItem,
    getAllOrderItems,
    getOrderItemsByOrderId,
};
