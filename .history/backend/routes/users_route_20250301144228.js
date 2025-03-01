const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
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

        // ตรวจสอบว่ามีการส่งข้อมูล username และ password มาหรือไม่
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        let user;
        // ตรวจสอบเงื่อนไข username == 'employee'
        if (username === 'employee') {
            user = await User.findOne({ password });
           
        } else {
            user = await User.findOne({ username, password,role_id });
        }

        // หากไม่พบ User
        if (!user) {
            return res.send('Invalid username or password');
        }

      

        // สร้าง JWT Token
        const token = jwt.sign({ id: user._id, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: "12h" });

        // ส่งข้อมูลกลับ (แต่ไม่ส่ง password)
        res.status(200).json({
            username: user.username,
            role_id: user.role_id,
            token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;