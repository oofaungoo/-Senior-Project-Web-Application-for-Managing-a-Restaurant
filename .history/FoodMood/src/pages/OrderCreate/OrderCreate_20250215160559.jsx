import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuList_Order from './assets/MenuList_Order';
import MenuItemSelected from './assets/MenuItemSelected';
import CartSummary from './assets/CartSummary';
import './OrderCreate.css';

{/* BUGS
    1. เวลาจะ Edit Item ที่อยู่ใน Cart มันไม่ยอมดึงข้อมูลเก่ามาให้แก้ (มัน reset ใหม่หมดเลย)  
*/}

const OrderCreate = () => {
    const [data, setData] = useState([]);
    const [category, setCategory] = useState([]);
    const [cartItems, setCartItems] = useState([]);         //Item(s) in cart
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [note, setNote] = useState('');

    const [ingredientRemain, setIngredientRemain] = useState([]);

    // API: Fetch data from database
    useEffect(() => {
        axios.get('http://localhost:5000/api/foods')
            .then(res => { setData(res.data) })
            .catch(err => console.error('Error fetching :', err));
        axios.get('http://localhost:5000/api/add_menus/category')
            .then(res => { setCategory(res.data) })
            .catch(err => console.error('Error fetching :', err));
        axios.get('http://localhost:5000/api/ingredients')
            .then(res => { setIngredientRemain(res.data)
                console.log("Ingredient Remain : ", res.data)
            })
            .catch(err => console.error('Error fetching :', err));
    }, []);

    //API: Add New Order
    const handleSaveData = async (orderData) => {
        try {
            console.log("ขั้นตอนสุดท้าย ฉันกำลังจะนำเข้าข้อมูล : ", orderData)
            const response = await axios.post('http://localhost:5000/api/orders', orderData);
            console.log('Order saved:', response.data);
            setCartItems([]); // ✅ ล้างตะกร้าหลังบันทึกสำเร็จ
        } catch (error) {
            console.error('Error saving order:', error);
        }
    };

    // Function: Handle Menu Click & Set default for every option that exists.
    const handleMenuClick = (item) => {
        console.log("ฉันกำลังคลิกไปที่เมนู : ", item)
        setSelectedItem(item);                          //กำหนด SelectedItem ให้เป็น item ที่เรากำลังคลิกอยู่
        setSelectedSize(item.sizePrices[0].size);       //เราจะทำการ auto ให้เลือกที่ขนาดแรกที่มีใน database ไปเลย เพื่อป้องกันผู้ใช้ไม่เลือกขนาด
    };

    // Fuction: Change size in MenuItemSelected.jsx
    const handleSizeChange = (size) => { setSelectedSize(size); };

    // Fuction: Handle Quantity Change (Increase & Decrease, in order) in MenuItemSelected.jsx
    const handleQuantityIncrease = () => { setQuantity((prevQuantity) => prevQuantity + 1); };
    const handleQuantityDecrease = () => { setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1)); };

    // Function: Add item to cart (from MenuItemSelected.jsx ---> to CartSummary.jsx)
    const handleConfirmAdd = () => {
        const selectedSizeData = selectedItem.sizePrices.find(s => s.size === selectedSize);

        const newItem = {
            //id: selectedItem._id,
            name: selectedItem.name,
            size: selectedSize,
            price: selectedSizeData.price,
            quantity: quantity,
            note: note,
            selectedOptions: selectedOptions,
        };
        console.log("ฉันเพิ่มเมนู : ", newItem)

        setCartItems([...cartItems, newItem]);

        setSelectedItem(null);
        setQuantity(1);
        setSelectedSize('')
        setSelectedOptions({});
        setNote('');
        
    };


    // Function: Remove Item (from cart)
    const handleRemoveItem = (indexToRemove) => { setCartItems(cartItems.filter((_, index) => index !== indexToRemove)); };

    // Function: Edit Item (in cart)
    const handleEditItem = (indexToEdit) => {
        const itemToEdit = cartItems[indexToEdit];
    
        // ค้นหาเมนูจริงจากฐานข้อมูล เพื่อดึง sizePrices ที่ถูกต้อง
        const originalMenuItem = data.find(menu => menu.name === itemToEdit.name);
    
        setSelectedItem({
            ...originalMenuItem,  // ใช้ข้อมูลต้นฉบับ เพื่อให้ sizePrices มีค่า
            size: itemToEdit.size,
            price: itemToEdit.price,
            quantity: itemToEdit.quantity,
            note: itemToEdit.note,
            selectedOptions: itemToEdit.selectedOptions || {},
        });
    
        setSelectedSize(itemToEdit.size);
        setQuantity(itemToEdit.quantity);
        setNote(itemToEdit.note);
        setSelectedOptions(itemToEdit.selectedOptions || {});
    
        // เอารายการที่ถูกแก้ออกจากตะกร้า เพื่อไม่ให้ซ้ำ
        setCartItems(cartItems.filter((_, index) => index !== indexToEdit));
    };

    // Function: Calculate total price of item(s) in cart.
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <div className='container'>
            <MenuList_Order
                data={data}
                category={category}
                onMenuClick={handleMenuClick}
                selectedItem={selectedItem}
            />
            <div className='right-box fr-18'>
                {selectedItem ? (
                    <MenuItemSelected
                        selectedItem={selectedItem}
                        selectedSize={selectedSize}
                        quantity={quantity}
                        note={note}
                        selectedOptions={selectedOptions} // ✅ Pass selectedOptions
                        setSelectedOptions={setSelectedOptions} // ✅ Pass setSelectedOptions
                        handleSizeChange={handleSizeChange}
                        handleQuantityIncrease={handleQuantityIncrease}
                        handleQuantityDecrease={handleQuantityDecrease}
                        handleConfirmAdd={handleConfirmAdd}
                        setNote={setNote}
                    />
                ) : (
                    <CartSummary
                        cartItems={cartItems}
                        totalPrice={totalPrice}
                        handleEditItem={handleEditItem}
                        handleRemoveItem={handleRemoveItem}
                        onSave={handleSaveData}
                    />
                )}
            </div>
        </div>
    );
};

export default OrderCreate;
