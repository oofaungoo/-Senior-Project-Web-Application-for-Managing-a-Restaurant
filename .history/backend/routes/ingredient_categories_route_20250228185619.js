const express = require('express');
const router = express.Router();
const dataDB = require('../models/ingredients_categories'); // เรียกใช้ Model

// Route ดึงข้อมูลทั้งหมด
router.get('/', async (req, res) => {
    try {
        const result = await dataDB.find();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; // ต้องมีบรรทัดนี้เพื่อให้ `require()` ใช้งานได้
