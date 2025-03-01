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
    try {
        const { username, name, password, phone_number, role_id } = req.body;

        if (role_id === '1') {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ error: "Username นี้ถูกใช้ไปแล้ว" });
            }
        }

        const users = await User.find();
        for (const user of users) {
            const isSamePassword = await bcrypt.compare(password, user.password);
            if (isSamePassword) {
                return res.status(400).json({ error: "รหัสผ่านนี้ถูกใช้ไปแล้ว กรุณาตั้งรหัสใหม่" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            name,
            password: hashedPassword,
            phone_number,
            role_id,
        });

        await newUser.save();
        res.status(201).json({ message: "สร้างบัญชีสำเร็จ", user: newUser });

    } catch (error) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, name, phone_number, role_id, password } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // เช็คว่า username ซ้ำหรือไม่ (ถ้ามีการเปลี่ยนแปลง)
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ error: "Username นี้ถูกใช้ไปแล้ว" });
            }
            user.username = username;
        }

        // เช็คว่า password ซ้ำหรือไม่ (ถ้ามีการเปลี่ยนแปลง)
        if (password) {
            const users = await User.find();
            for (const otherUser of users) {
                const isSamePassword = await bcrypt.compare(password, otherUser.password);
                if (isSamePassword) {
                    return res.status(400).json({ error: "รหัสผ่านนี้ถูกใช้ไปแล้ว กรุณาตั้งรหัสใหม่" });
                }
            }
            user.password = await bcrypt.hash(password, 10); // เข้ารหัส password
        }

        // อัปเดตฟิลด์อื่น ๆ
        if (name) user.name = name;
        if (phone_number) user.phone_number = phone_number;
        if (role_id) user.role_id = role_id;

        const updatedUser = await user.save();
        res.json({ message: "อัปเดตข้อมูลสำเร็จ", user: updatedUser });

    } catch (error) {
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
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
            { id: user._id, name: user.name, role_id: user.role_id },
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
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;