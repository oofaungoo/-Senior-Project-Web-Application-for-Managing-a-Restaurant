const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
// const bcrypt = require("bcryptjs");
const User = require('../models/users');
const Role = require('../models/roles');
const bcrypt = require('bcrypt');

// **Middleware ตรวจสอบ Token**
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

router.post("/register", async (req, res) => {
    const { username, password, name, phone_number } = req.body;
    // ตรวจสอบว่าข้อมูลครบมั้ย
    if (!username || !password || !name || !phone_number) {
        return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }
    // ตรวจสอบว่ามี username ไปซ้ำกับคนอื่นหรือไม่ (กรณีเป็น admin)
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ error: "Username นี้ถูกใช้ไปแล้ว" });
    }
    // ตรวจสอบว่า password ไปซ้ำกับคนอื่นมั้ย
    const users = await User.find();
    for (const user of users) {
        const isSamePassword = await bcrypt.compare(password, user.password);
        if (isSamePassword) {
            return res.status(400).json({ error: "รหัสผ่านนี้ถูกใช้ไปแล้ว กรุณาตั้งรหัสใหม่" });
        }
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ 
            username, 
            password: hashedPassword, 
            name, 
            phone_number, 
            role_id: "1"
        });

        await newUser.save();
        res.json({ message: "เพิ่มแอดมินสำเร็จ" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        const roles = await Role.find();
        const newUsers = users.map(user => {
            const role = roles.find(acc => user.role_id.toString() === acc._id.toString());
            return {
                ...user.toObject(),
                role_name: role ? role.role_name : 'Unknown'
            };
        });

        res.json(newUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    res.json(res.user);
});

router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
        name: req.body.name,
        password: req.body.password,
        phone_number: req.body.phone_number,
        role_id: req.body.role_id,
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const user = await User.findById(id);  // Retrieve the user by ID

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.body.name != null) {
            user.name = req.body.name;
        }
        if (req.body.phone_number != null) {
            user.phone_number = req.body.phone_number;
        }
        if (req.body.role_id != null) {
            user.role_id = req.body.role_id;
        }
        if (req.body.password != null) {
            user.password = req.body.password;
        }
        if (req.body.username != null) {
            user.username = req.body.username;
        }

        const updatedUser = await user.save();

        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.json({ message: 'Deleted User' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('🔹 Login Attempt:', { username, password });

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // 🔹 ค้นหา user ก่อน
        let user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // 🔹 ตรวจสอบรหัสผ่าน
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password (Wrong password)' });
        }

        // 🔹 สร้าง token
        const token = jwt.sign(
            { id: user._id, role: user.role_id },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: "12h" }
        );

        // 🔹 ส่งข้อมูลกลับ
        res.status(200).json({
            username: user.username,
            role_id: user.role_id,
            token: token
        });

    } catch (error) {
        console.error('❌ Login Error:', error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;