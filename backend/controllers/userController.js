

const softDeleteUser = (req, res) => {
    const { id } = req.params;
    const sql = `
        UPDATE user
        SET deleted = true, deleted_at = NOW()
        WHERE id = ?
    `;
    req.db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json({ message: 'User deleted' });
    });
};

const getAllUsers = (req, res) => {
    const sql = `
        SELECT *
        FROM user
        WHERE deleted = false
    `;
    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json(results);
    });
};

const getAllClients = (req, res) => {
    const sql = `
        SELECT user.*
        FROM user
        JOIN user_status ON user.status_id = user_status.id
        WHERE user_status.name = 'CLIENT' AND user.deleted = false
    `;
    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching client users:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json(results);
    });
};



const getUserById = (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT id, last_name, email, created_at
        FROM user
        WHERE id = ? AND deleted = false
    `;
    req.db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(results[0]);
    });
};

const updateUserById = (req, res) => {
    const { id } = req.params;
    const { balance, extra_balance } = req.body;

    const sql = `UPDATE user SET balance = ?, extra_balance = ? WHERE id = ?`;

    req.db.query(sql, [balance, extra_balance, id], (err) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du user :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.status(200).json({ message: 'user mis à jour' });
        }
    });
};

module.exports = {
    softDeleteUser,
    getAllUsers,
    getUserById,
    updateUserById,
    getAllClients,
};

