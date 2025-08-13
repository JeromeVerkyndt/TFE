/**
 * @swagger
 * tags:
 *   name: Stock
 *   description: API pour gérer le stock
 */

/**
 * @swagger
 * /stock:
 *   get:
 *     summary: Récupérer tout le stock (non supprimé)
 *     tags: [Stock]
 *     responses:
 *       200:
 *         description: Liste du stock
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Erreur serveur
 */
const getAllStock = (req, res) => {
    const sql = `SELECT * FROM stock WHERE deleted = FALSE and quantity >= 0`;

    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des stock :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.status(200).json(results);
        }
    });
};

/**
 * @swagger
 * /stock:
 *   post:
 *     summary: Ajouter un stock
 *     tags: [Stock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               promo:
 *                 type: number
 *             required:
 *               - product_id
 *               - quantity
 *     responses:
 *       201:
 *         description: Stock ajouté avec succès
 *       500:
 *         description: Erreur serveur
 */
const createStock = (req, res) => {
    const { product_id, quantity, promo } = req.body;
    const sql = `INSERT INTO stock (product_id, quantity, promo, created_at, deleted, deleted_at)
               VALUES (?, ?, ?, NOW(), false, NULL)`;

    req.db.query(sql, [product_id, quantity, promo], (err, result) => {
        if (err) {
            console.error('Erreur insertion stock :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.status(201).json({ message: 'Stock ajouté avec succès' });
    });
};

/**
 * @swagger
 * /stock/{id}:
 *   delete:
 *     summary: Soft delete un stock par ID
 *     tags: [Stock]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du stock à supprimer
 *     responses:
 *       200:
 *         description: Stock marqué comme supprimé
 *       500:
 *         description: Erreur serveur
 */
const softDeleteStock = (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE stock SET deleted = TRUE, deleted_at = NOW() WHERE id = ?`;

    req.db.query(sql, [id], (err) => {
        if (err) {
            console.error('Erreur lors du soft delete du stock :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.status(200).json({ message: 'Stock marqué comme supprimé' });
        }
    });
};

/**
 * @swagger
 * /stock/data:
 *   get:
 *     summary: Récupér les données complètes du stock associer aux données produits
 *     tags: [Stock]
 *     responses:
 *       200:
 *         description: Liste du stock avec détails produits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Erreur serveur
 */
const getAllDataStock = (req, res) => {
    const sql = `
        SELECT stock.*, products.name AS product_name, products.description As product_description, products.price As product_price, products.unit As product_unit, products.image_url As product_image_url, products.included_in_subscription As included
        FROM stock
        JOIN products ON stock.product_id = products.id
        WHERE stock.deleted = FALSE
    `;

    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération du stock :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.status(200).json(results);
        }
    });
};

/**
 * @swagger
 * /stock/{id}:
 *   put:
 *     summary: Mettre à jour un stock par son ID (quantité et promo)
 *     tags: [Stock]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID du stock à mettre à jour
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
 *               quantity:
 *                 type: integer
 *               promo:
 *                 type: number
 *             required:
 *               - quantity
 *     responses:
 *       200:
 *         description: Stock mis à jour
 *       500:
 *         description: Erreur serveur
 */
const updateStockById = (req, res) => {
    const { id } = req.params;
    const { quantity, promo } = req.body;

    const sql = `UPDATE stock SET quantity = ?, promo = ? WHERE id = ?`;

    req.db.query(sql, [quantity, promo, id], (err) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du stock :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.status(200).json({ message: 'Stock mis à jour' });
        }
    });
};

/**
 * @swagger
 * /stock/{id}/decrease:
 *   patch:
 *     summary: Diminue de x la quantité de stock par ID
 *     tags: [Stock]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID du stock à diminuer
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
 *               quantityToSubtract:
 *                 type: integer
 *             required:
 *               - quantityToSubtract
 *     responses:
 *       200:
 *         description: Stock diminué avec succès
 *       400:
 *         description: Stock insuffisant ou produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
const decreaseStockById = (req, res) => {
    const { id } = req.params;
    const { quantityToSubtract } = req.body;

    const sql = `UPDATE stock SET quantity = quantity - ? WHERE id = ? AND quantity >= ?`;

    req.db.query(sql, [quantityToSubtract, id, quantityToSubtract], (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du stock :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else if (result.affectedRows === 0) {
            res.status(400).json({ error: 'Stock insuffisant ou produit non trouvé' });
        } else {
            res.status(200).json({ message: 'Stock diminué avec succès' });
        }
    });
};


module.exports = {
    getAllStock,
    createStock,
    softDeleteStock,
    getAllDataStock,
    updateStockById,
    decreaseStockById,
};