
const getTransactionByUserId = (req, res) => {
    const { user_id } = req.params;
    const sql = `
        SELECT * FROM transaction
        WHERE user_id = ? AND deleted = FALSE
    `;
    req.db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching transaction by user_id:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json(results);
    });
};

const createTransaction = (req, res) => {
    const { user_id, amount, type, order_id } = req.body;

    if (!user_id || !amount || !type) {
        return res.status(400).json({ error: "Champs requis manquants" });
    }

    const sql = `
        INSERT INTO transaction (user_id, amount, type, order_id, created_at)
        VALUES (?, ?, ?, ?, NOW())
    `;

    req.db.query(
        sql,
        [user_id, amount, type, order_id || null],
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
