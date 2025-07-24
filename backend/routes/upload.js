const express = require("express");
const multer = require("multer");
const cloudinary = require("../cloudinary");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
    try {
        const originalPath = req.file.path;
        const pngPath = `${originalPath}.png`;

        // Convertir en png (sharp)
        await sharp(originalPath)
            .png()
            .toFile(pngPath);

        // Envoyer à Cloudinary
        const result = await cloudinary.uploader.upload(pngPath, {
            folder: "produits",
            resource_type: "image",
        });

        // Supprimer fichiers temporaires
        fs.unlinkSync(originalPath);
        fs.unlinkSync(pngPath);

        res.json({ imageUrl: result.secure_url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur d’upload" });
    }
});

module.exports = router;
