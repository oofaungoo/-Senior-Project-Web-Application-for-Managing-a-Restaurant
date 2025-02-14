const express = require('express');
const router = express.Router();

const dataDB = require('../models/roles');

router.get('/', async (req, res) => {
    try {
        const result = await dataDB.find();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await fetchDataFromDatabase(id);  // ฟังก์ชันดึงข้อมูลจากฐานข้อมูล
        res.json(data);  // ส่งข้อมูลออกมา
    } catch (error) {
        res.status(500).json({ error: 'มีบางอย่างผิดพลาด' });
    }
});

module.exports = router;