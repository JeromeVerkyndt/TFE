/**
 * @swagger
 * tags:
 *   name: Product
 *   description: API pour gérer les produits
 */
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Ajoute un nouveau produit
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tomates"
 *               description:
 *                 type: string
 *                 example: "Tomates fraîches bio"
 *               unit:
 *                 type: string
 *                 example: "kg"
 *               price:
 *                 type: number
 *                 example: 3.5
 *               included_in_subscription:
 *                 type: boolean
 *                 example: false
 *               image_url:
 *                 type: string
 *                 example: "http://exemple.com/tomates.jpg"
 *               promo:
 *                 type: number
 *                 example: 0
 *     responses:
 *       201:
 *         description: Produit ajouté avec succès
 *       500:
 *         description: Erreur serveur
 */
const addProduct = (req, res) => {
    const {
        name,
        description,
        unit,
        price,
        included_in_subscription,
        image_url,
        promo
    } = req.body;

    if (
        !name ||
        !unit ||
        price === undefined ||
        included_in_subscription === undefined
    ) {
        return res.status(400).json({
            error: 'name, unit, price, included_in_subscription sont requis'
        });
    }

    const sql = `
    INSERT INTO product (name, description, unit, price, included_in_subscription, image_url, promo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

    req.db.query(
        sql,
        [name, description, unit, price, included_in_subscription, image_url, promo],
        (err, result) => {
            if (err) {
                console.error('Erreur MySQL:', err);
                res.status(500).json({ error: 'Erreur lors de l\'ajout du produit' });
            } else {
                res.status(201).json({ message: 'Produit ajouté', productId: result.insertId });
            }
        }
    );
};

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Récupère tous les produits non supprimés
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Liste des produits
 *       500:
 *         description: Erreur serveur
 */
const getAllProducts = (req, res) => {
    const sql = `SELECT * FROM product WHERE deleted = FALSE`;

    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des produits :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.status(200).json(results);
        }
    });
};

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Supprime un produit (soft delete)
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du produit à supprimer
 *     responses:
 *       200:
 *         description: Produit marqué comme supprimé
 *       500:
 *         description: Erreur serveur
 */
const softDeleteProduct = (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE product SET deleted = TRUE, deleted_at = NOW() WHERE id = ?`;

    req.db.query(sql, [id], (err) => {
        if (err) {
            console.error('Erreur lors du soft delete du produit :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.status(200).json({ message: 'Produit marqué comme supprimé' });
        }
    });
};

/**
 * @swagger
 * /api/products/update/{id}:
 *   put:
 *     summary: Met à jour un produit par ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du produit à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tomates modifiées"
 *               description:
 *                 type: string
 *                 example: "Description mise à jour"
 *               price:
 *                 type: number
 *                 example: 4.0
 *               included_in_subscription:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Produit mis à jour
 *       500:
 *         description: Erreur serveur
 */
const updateProductById = (req, res) => {
    const { id } = req.params;
    const { name, description, price, included_in_subscription } = req.body;

    const sql = `UPDATE product SET name = ?, description = ?, price = ?, included_in_subscription = ? WHERE id = ?`;

    req.db.query(sql, [name, description, price, included_in_subscription, id], (err) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du produit :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.status(200).json({ message: 'Produit mis à jour' });
        }
    });
};

module.exports = {
    addProduct,
    getAllProducts,
    softDeleteProduct,
    updateProductById
};

