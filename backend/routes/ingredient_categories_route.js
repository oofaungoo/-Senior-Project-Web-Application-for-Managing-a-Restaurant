const express = require('express');
const router = express.Router();
const dataDB = require('../models/ingredients_categories');

router.get('/', async (req, res) => {
    try {
        const result = await dataDB.find();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
