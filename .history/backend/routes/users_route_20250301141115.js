const express = require('express');
const router = express.Router();
const JWT = require('jsonwebtoken');

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
            const token = JWT.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"12h"});
            user = {
                username: user.username,
                password: user.password,
                token:token,
                role_id:user.role_id
            }
        } else {
            user = await User.findOne({ username, password,role_id });
        }

        // หากไม่พบ User
        if (!user) {
            return res.send('Invalid username or password');
        }

        // ส่งข้อมูล User กลับไป (ยกเว้น password)
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(200).json(userWithoutPassword);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;