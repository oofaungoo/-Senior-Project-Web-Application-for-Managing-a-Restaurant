const express = require('express');
const router = express.Router();

const dataDB1 = require('../models/food_categories');
const dataDB2 = require('../models/food_sizes');

router.get('/category', async (req, res) => {
    try {
        const result = await dataDB1.find();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/size', async (req, res) => {
    try {
        const result = await dataDB2.find();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    res.json(res.result);
});

module.exports = router;

