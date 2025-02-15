const express = require('express');
const router = express.Router();

const dataDB = require('../models/ingredients');

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
    const { name, group, remain, min, unit } = req.body;

    try {
        const data = new dataDB({
            name: name,
            group: group,
            unit: unit,
            remain: Number(remain || 0),
            min: Number(min || 0)
        });

        const newData = await data.save();
        res.status(201).json(newData);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});
router.put('/', async (req, res) => {
    const { data } = req.body;

    try {
        const data = new dataDB(data);

        const newData = await data.save();
        res.status(201).json(newData);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const data = await dataDB.findById(id);

        if (!data) return res.status(404).json({ message: 'ไม่พบวัตถุดิบในระบบ' });

        if (req.body.name != null) {
            data.name = req.body.name;
        }
        if (req.body.group != null) {
            data.group = req.body.group;
        }
        if (req.body.unit != null) {
            data.unit = req.body.unit;
        }
        if (req.body.remain != null) {
            data.remain = req.body.remain;
        }
        if (req.body.min != null) {
            data.min = req.body.min;
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
        res.json({ message: 'ลบวัตถุดิบออกจาก Database เรียบร้อยแล้ว' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;