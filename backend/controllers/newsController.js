/**
 * @swagger
 * tags:
 *   - name: News
 *     description: API de gestion des news
 */

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Créer une news
 *     tags: [News]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - text
 *             properties:
 *               title:
 *                 type: string
 *                 example: Nouvelle mise à jour
 *               text:
 *                 type: string
 *                 example: Voici le texte de la news.
 *     responses:
 *       201:
 *         description: News ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: News ajouté
 *                 insertId:
 *                   type: integer
 *                   example: 42
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erreur lors de l'ajout d une news
 */
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

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Récupérer toutes les news non supprimées avec leurs images (Cloudinary)
 *     tags: [News]
 *     responses:
 *       200:
 *         description: Liste des news
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 42
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-08-13T12:34:56Z
 *                   title:
 *                     type: string
 *                     example: Nouvelle mise à jour
 *                   text:
 *                     type: string
 *                     example: Voici le texte de la news.
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: uri
 *                       example: https://exemple.com/image.jpg
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erreur serveur
 */
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

/**
 * @swagger
 * /api/news/image/{id}:
 *   post:
 *     summary: Ajouter une image à une news
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la news
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageUrl
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://exemple.com/image.jpg
 *     responses:
 *       201:
 *         description: Image ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Image ajoutée avec succès
 *                 imageUrl:
 *                   type: string
 *                   example: https://exemple.com/image.jpg
 *       400:
 *         description: Aucune URL d'image fournie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Aucune URL d'image fournie
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erreur lors de l'ajout de l'image
 */
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

/**
 * @swagger
 * /api/news/delete/{id}:
 *   patch:
 *     summary: Supprimer une news (soft delete)
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la news à supprimer
 *     responses:
 *       200:
 *         description: News supprimée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: News deleted
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
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