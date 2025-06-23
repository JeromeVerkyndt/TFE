// backend/routes/upload.js
const express = require("express");
const multer = require("multer");
const cloudinary = require("../cloudinary");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "produits", // facultatif, pour organiser dans Cloudinary
        });

        fs.unlinkSync(req.file.path); // supprime le fichier temporaire

        res.json({ imageUrl: result.secure_url });
    } catch (err) {
        res.status(500).json({ error: "Erreur d’upload" });
    }
});

module.exports = router;
