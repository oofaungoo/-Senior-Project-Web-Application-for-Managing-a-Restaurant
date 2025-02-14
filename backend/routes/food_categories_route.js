const express = require('express');
const router = express.Router();

const dataDB = require('../models/food_categories');

router.get('/', async (req, res) => {
    try {
        const result = await dataDB.find();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    res.json(res.result);
});

module.exports = router;