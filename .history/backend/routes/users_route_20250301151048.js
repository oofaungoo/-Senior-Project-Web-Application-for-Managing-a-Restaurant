const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const User = require('../models/users');

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
  
router.get('/',verifyToken, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id',verifyToken, async (req, res) => {
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
        console.log('🔹 Login Attempt:', { username, password }); // Log ค่าที่ได้รับ

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) {
        //     return res.status(401).json({ message: 'Invalid username or password (Wrong password)' });
        // }

        let user;
        if (username === 'employee') {
            user = await User.findOne({ password });
            console.log('🔹 Found User:', user); // Log User ที่หาเจอ

            if (!user) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            const token = jwt.sign(
                { id: user._id, role: user.role_id },
                process.env.JWT_SECRET || 'default_secret',
                { expiresIn: "12h" }
            );

            user = {
                username: user.username,
                role_id: user.role_id,
                token: token
            };
        } else {
            user = await User.findOne({ username, password });
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error('❌ Login Error:', error);
        res.status(500).json({ message: error.message });
    }
});
// **สมัครสมาชิก**
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });

  try {
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



module.exports = router;