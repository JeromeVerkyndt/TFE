const addNews = (req, res) => {
    const {
        text,
        title
    } = req.body;

    const sql = `
    INSERT INTO news (text, title)
    VALUES (?, ?)
  `;

    req.db.query(
        sql,
        [text, title],
        (err, result) => {
            if (err) {
                console.error('Erreur MySQL:', err);
                res.status(500).json({ error: 'Erreur lors de l\'ajout d une news' });
            } else {
                res.status(201).json({ message: 'News ajouté' });
            }
        }
    );
};

const getAllNews = (req, res) => {
    const sql = `SELECT * FROM news`;

    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des news :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.status(200).json(results);
        }
    });
};

module.exports = {
    addNews,
    getAllNews
};