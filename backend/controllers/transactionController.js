
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

module.exports = {

    getTransactionByUserId
};
