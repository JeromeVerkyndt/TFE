const createUser = (req, res) => {
    const { username, email, password } = req.body;
    const sql = `
        INSERT INTO users (username, email, password, created_at, deleted, deleted_at)
        VALUES (?, ?, ?, NOW(), false, NULL)
    `;
    req.db.query(sql, [username, email, password], (err, result) => {
        if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(201).json({ message: 'User created', userId: result.insertId });
    });
};

const softDeleteUser = (req, res) => {
    const { id } = req.params;
    const sql = `
        UPDATE users
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
        SELECT id, username, email, created_at
        FROM users
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

const getUserById = (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT id, username, email, created_at
        FROM users
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

module.exports = {
    createUser,
    softDeleteUser,
    getAllUsers,
    getUserById
};

