const express = require('express');
const router = express.Router();

const dataDB = require('../models/orders');

// 📌 Get all orders
router.get('/', async (req, res) => {
    try {
        const result = await dataDB.find();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Get an order by ID
router.get('/:id', async (req, res) => {
    try {
        const data = await dataDB.findById(req.params.id);                          //ค้นหา data (order) ใน dataDB
        if (!data) return res.status(404).json({ message: 'ไม่พบ Order ในระบบ' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Create a new order
router.post('/', async (req, res) => {
    try {
        const todayDate = new Date().toLocaleDateString('en-GB');   //กำหนด todayDate ให้เป็นวันปัจจุบันก่อน โดยมี format: DD/MM/YYYY

        //ค้นหา latestOrder ที่มี orderDate เท่ากับ todayDate
        //และทำการหา order สุดท้ายของวันนั้น (หมายความ lastestOrder จะเป็น null และข้ามเงื่อนไข if บรรทัดที่ 37 ไป)
        const latestOrder = await dataDB.findOne({ orderDate: todayDate }).sort({ orderNumber: -1 });   

        let newOrderNumber = 1; //กำหนด newOrderNumber ให้เป็น 1 
        if (latestOrder) {      //ถ้ามี latestOrder หรือก็คือ order ก่อนหน้าก็จะดึงหมายเลข orderNumber ของ order ก่อนหน้ามา +1
            newOrderNumber = latestOrder.orderNumber + 1;
        }

        const order = new dataDB({
            orderNumber: newOrderNumber,
            orderDate: todayDate,
            orderTime: new Date().toLocaleTimeString(),
            orderItems: req.body.items,
            orderType: req.body.orderType,
            contactInfo: req.body.contactInfo,
            orderStatus: 'ยังไม่เริ่มทำ',
            totalPrice: req.body.total
        });

        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// 📌 Update an order by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedOrder = await dataDB.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }, // อัปเดตเฉพาะฟิลด์ที่ส่งมา
            { new: true, runValidators: true } // คืนค่าล่าสุดและตรวจสอบความถูกต้อง
        );

        if (!updatedOrder) return res.status(404).json({ message: 'ไม่พบ Order ในระบบ' });

        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 📌 Delete an order by ID
router.delete('/:id', async (req, res) => {
    try {
        const order = await dataDB.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'ไม่พบ Order ในระบ' });

        res.json({ message: 'ลบ Order สำเร็จแล้ว' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
