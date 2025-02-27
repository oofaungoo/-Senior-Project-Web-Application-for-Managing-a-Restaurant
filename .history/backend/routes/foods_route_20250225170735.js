const express = require('express');
const router = express.Router();

const dataDB = require('../models/foods');

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

router.post('/', async (req, res) => {
    const result = new dataDB({
        name: req.body.name,
        category_id: req.body.category_id,
        category: req.body.category,
        image:  req.body.image,
        sizePrices: req.body.sizePrices,
        customOptions: req.body.customOptions
    });

    try {
        const newResult = await result.save();
        res.status(201).json(newResult);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const data = await dataDB.findById(id);

        if (!data) return res.status(404).json({ message: 'ไม่พบอาหารในระบบ' });

        if (req.body.name != null) {
            data.name = req.body.name;
        }
        if (req.body.category_id != null) {
            data.category_id = req.body.category_id;
        }
        if (req.body.category != null) {
            data.category = req.body.category;
        }
        if (req.body.sizePrices != null) {
            data.sizePrices = req.body.sizePrices;
        }
        if (req.body.customOptions != null) {
            data.customOptions = req.body.customOptions;
        }
        if (req.body.image != null) {
            data.result.image = req.body.image;
        }

        const updatedData = await data.save();

        res.json(updatedData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await dataDB.findByIdAndDelete(req.params.id)
        res.json({ message: 'ลบรายการอาหารออกจาก Database เรียบร้อยแล้ว' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;