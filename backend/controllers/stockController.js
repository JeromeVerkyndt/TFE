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
    const { name, quantity } = req.body;
    const sql = `INSERT INTO stock (name, quantity) VALUES (?, ?)`;

    req.db.query(sql, [name, quantity], (err, result) => {
        if (err) {
            console.error('Erreur lors de la création du stock :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.status(201).json({ message: 'Stock ajouté', id: result.insertId });
        }
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


module.exports = {
    getAllStock,
    createStock,
    softDeleteStock,
};