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
                res.status(201).json({ message: 'News ajouté', insertId: result.insertId });
            }
        }
    );
};

const getAllNews = (req, res) => {
    const sql = `
        SELECT n.*, ni.image_url
        FROM news n
        LEFT JOIN news_image ni ON n.id = ni.news_id
        WHERE deleted = false
    `;

    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des news :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        // Regrouper les images par news
        const newsMap = {};

        results.forEach(row => {
            if (!newsMap[row.id]) {
                newsMap[row.id] = {
                    id: row.id,
                    created_at: row.created_at,
                    title: row.title,
                    text: row.text,
                    images: []
                };
            }
            if (row.image_url) {
                newsMap[row.id].images.push(row.image_url);
            }
        });

        const finalNews = Object.values(newsMap).sort((a, b) => b.id - a.id);
        res.status(200).json(finalNews);
    });
};


const addImageUrlToNews = (req, res) => {
    const newsId = req.params.id;
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: 'Aucune URL d\'image fournie' });
    }

    const sql = `
        INSERT INTO news_image (news_id, image_url)
        VALUES (?, ?)
    `;

    req.db.query(sql, [newsId, imageUrl], (err, result) => {
        if (err) {
            console.error('Erreur MySQL :', err);
            return res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'image' });
        }

        res.status(201).json({ message: 'Image ajoutée avec succès', imageUrl });
    });
};

const softDeleteNews = (req, res) => {
    const { id } = req.params;
    const sql = `
        UPDATE news
        SET deleted = true, deleted_at = NOW()
        WHERE id = ?
    `;
    req.db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting news:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json({ message: 'News deleted' });
    });
};


module.exports = {
    addNews,
    getAllNews,
    addImageUrlToNews,
    softDeleteNews
};