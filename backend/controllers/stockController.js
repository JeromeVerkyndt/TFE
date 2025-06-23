const getAllStock = (req, res) => {
    const sql = `SELECT * FROM stock WHERE deleted = FALSE`;

    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des stock :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.status(200).json(results);
        }
    });
};

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

const getAllDataStock = (req, res) => {
    const sql = `
        SELECT stock.*, products.name AS product_name, products.description As product_description, products.price As product_price, products.unit As product_unit
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