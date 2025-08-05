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

    const sql = `
    INSERT INTO products (name, description, unit, price, included_in_subscription, image_url, promo)
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

const getAllProducts = (req, res) => {
    const sql = `SELECT * FROM products WHERE deleted = FALSE`;

    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des produits :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.status(200).json(results);
        }
    });
};

const softDeleteProduct = (req, res) => {
    const { id } = req.params;
    const sql = `UPDATE products SET deleted = TRUE, deleted_at = NOW() WHERE id = ?`;

    req.db.query(sql, [id], (err) => {
        if (err) {
            console.error('Erreur lors du soft delete du produit :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.status(200).json({ message: 'Produit marqué comme supprimé' });
        }
    });
};

const updateProductById = (req, res) => {
    const { id } = req.params;
    const { name, description, price, included_in_subscription } = req.body;

    const sql = `UPDATE products SET name = ?, description = ?, price = ?, included_in_subscription = ? WHERE id = ?`;

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

