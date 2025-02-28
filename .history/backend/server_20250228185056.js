const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User_route = require('./routes/users_route');
const Food_route = require('./routes/foods_route');
const Add_menu_route = require('./routes/add_menus_route');
const Ingredients_route = require('./routes/ingredients_route');
const Ingredient_categories = require('./routes/ingredient_categories_route');
const Role_route = require('./routes/roles_route');
const Order_route = require('./routes/order_routes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // อนุญาตให้ Frontend เชื่อมต่อ
app.use(express.json()); // อ่านข้อมูลแบบ json

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/foodmood", {useNewUrlParser: true,useUnifiedTopology: true,}).then(() => console.log("MongoDB Connected")).catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.get('/api', (req, res) => {
    res.send( 'Hello World' );
});

app.use('/api/users', User_route);
app.use('/api/foods', Food_route);
app.use('/api/add_menus', Add_menu_route);
app.use('/api/ingredients', Ingredients_route);
app.use('/api/ingredient_categories', Ingredient_categories)
app.use('/api/roles', Role_route);
app.use('/api/orders', Order_route);

// Server Start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});