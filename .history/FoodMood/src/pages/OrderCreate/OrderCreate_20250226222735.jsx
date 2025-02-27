import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Modal, useMediaQuery } from "@mui/material";
import MenuList_Order from './assets/MenuList_Order';
import MenuItemSelected from './assets/MenuItemSelected';
import CartSummary from './assets/CartSummary';
import './OrderCreate.css';

const OrderCreate = () => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1040px)");

    const [showSelectedMenu, setShowSelectedMenu] = useState(false);    //ใช้สำหรับ Mobile
    const [showCartModal, setShowCartModal] = useState(false);          //ใช้สำหรับ Mobile

    const [data, setData] = useState([]);
    const [category, setCategory] = useState([]);
    const [cartItems, setCartItems] = useState([]);         //Item(s) in cart
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [note, setNote] = useState('');

    const [ingredientRemain, setIngredientRemain] = useState([]);
    const [ingredientChange, setIngredientChange] = useState([]);

    // API: Fetch data from database
    useEffect(() => {
        axios.get('http://localhost:5000/api/foods')
            .then(res => { setData(res.data) })
            .catch(err => console.error('Error fetching :', err));
        axios.get('http://localhost:5000/api/add_menus/category')
            .then(res => { setCategory(res.data) })
            .catch(err => console.error('Error fetching :', err));
        axios.get('http://localhost:5000/api/ingredients')
            .then(res => {
                setIngredientRemain(res.data)
                setIngredientChange(res.data)
                console.log("Ingredient Remain : ", res.data)
            })
            .catch(err => console.error('Error fetching :', err));
    }, []);

    //API: Add New Order
    const handleSaveData = async (orderData) => {
        try {
            console.log("ขั้นตอนสุดท้าย ฉันกำลังจะนำเข้าข้อมูล : ", orderData)
            console.log("ขั้นตอนสุดท้าย ฉันกำลังจะหักวัตถุดิบ : ", ingredientRemain)
            const response = await axios.post('http://localhost:5000/api/orders', orderData);

            ingredientChange.map(async (acc) => {
                const response2 = await axios.put(`http://localhost:5000/api/ingredients/${acc._id}`, acc);
            });

            console.log('Order saved:', response.data);
            setCartItems([]); // ✅ ล้างตะกร้าหลังบันทึกสำเร็จ
        } catch (error) {
            console.error('Error saving order:', error);
        }
    };

    // Function: Handle Menu Click & Set default for every option that exists.
    const handleMenuClick = (item) => {
        console.log("ฉันกำลังคลิกไปที่เมนู : ", item)
        setSelectedItem(item);
        setSelectedSize(item.sizePrices[0].size);
        
        if (isMobile) {
            setShowSelectedMenu(true);
        }
    };

    // Fuction: Change size in MenuItemSelected.jsx
    const handleSizeChange = (size) => { setSelectedSize(size); };

    // Fuction: Handle Quantity Change (Increase & Decrease, in order) in MenuItemSelected.jsx
    const handleQuantityIncrease = () => { setQuantity((prevQuantity) => prevQuantity + 1); };
    const handleQuantityDecrease = () => { setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1)); };

    // Function: Add item to cart (from MenuItemSelected.jsx ---> to CartSummary.jsx)
    const handleConfirmAdd = () => {
        const selectedSizeData = selectedItem.sizePrices.find(s => s.size === selectedSize);

        console.log("ฉันกำลังเพิ่มเมนู : ", selectedSizeData)

        console.log("ingredientRemain : ", ingredientRemain);

        const ingredientProcess = ingredientRemain.map((acc) => {
            const ingredient = selectedSizeData.ingredients.find((acc2) => acc2.newIngredient === acc.name);
            if (ingredient) {
                return {
                    ...acc,
                    remain: acc.remain - ingredient.newIngredientQty * quantity
                };
            }
            return acc; // Keep the original if no change
        });

        const IngredientChangefilter = ingredientProcess.filter((acc, index) => acc.remain != ingredientChange[index].remain);

        console.log("IngredientChangefilter : ", IngredientChangefilter);

        setIngredientChange(IngredientChangefilter);
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
    <>
        {/* Box ของ MenuList */}
        <Box
            sx={{
                backgroundColor: "#fff",
                width: isMobile ? "100%" : isTablet ? "65%" : "75%",
                height: "100vh",
                padding: "20px",
                borderRadius: "8px",
                overflowY: "auto",
                marginRight: "10px",
            }}
        >
            <MenuList_Order
                data={data}
                category={category}
                onMenuClick={handleMenuClick}
            />
        </Box>

        {/* Desktop & Tablet: แสดง AddMenu และ MenuItemDetail ด้านขวา */}
        {!isMobile && (
            <Box
                sx={{
                    backgroundColor: "#fff",
                    width: isTablet ? "35%" : "25%",
                    height: "100vh",
                    padding: "20px",
                    borderRadius: "8px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {selectedItem ? (
                    <MenuItemSelected
                        selectedItem={selectedItem}
                        selectedSize={selectedSize}
                        quantity={quantity}
                        note={note}
                        selectedOptions={selectedOptions}
                        setSelectedOptions={setSelectedOptions}
                        handleSizeChange={handleSizeChange}
                        handleQuantityIncrease={handleQuantityIncrease}
                        handleQuantityDecrease={handleQuantityDecrease}
                        handleConfirmAdd={handleConfirmAdd}
                        setNote={setNote}
                        ingredientRemain={ingredientRemain}
                        onClose={() => setSelectedItem(false)}
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
            </Box>
        )}

        {/* Mobile - ใช้ Modal สำหรับ Selected Menu */}
        {isMobile && (
            <Modal
                open={showSelectedMenu}
                onClose={() => setShowSelectedMenu(false)}
            >
                <Box
                    sx={{
                        backgroundColor: "#fff",
                        padding: "15px",
                        borderRadius: "8px",
                        maxWidth: "90vw",
                        height: "80vh",
                        margin: "10vh auto",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {selectedItem ? (
                        <MenuItemSelected
                            selectedItem={selectedItem}
                            selectedSize={selectedSize}
                            quantity={quantity}
                            note={note}
                            selectedOptions={selectedOptions}
                            setSelectedOptions={setSelectedOptions}
                            handleSizeChange={handleSizeChange}
                            handleQuantityIncrease={handleQuantityIncrease}
                            handleQuantityDecrease={handleQuantityDecrease}
                            handleConfirmAdd={handleConfirmAdd}
                            setNote={setNote}
                            ingredientRemain={ingredientRemain}
                            onClose={() => setSelectedItem(null)}
                        />
                    ) : null}
                </Box>
            </Modal>
        )}

        {/* Mobile - กล่อง "ตะกร้าของฉัน" */}
        {isMobile && (
            <Box
                sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    textAlign: "center",
                    padding: "15px",
                    fontSize: "18px",
                    cursor: "pointer",
                }}
                onClick={() => setShowCartModal(true)}
            >
                🛒 ตะกร้าของฉัน ({cartItems.length} รายการ)
            </Box>
        )}

        {/* Mobile - ใช้ Modal สำหรับ Cart Summary */}
        {isMobile && (
            <Modal open={showCartModal} onClose={() => setShowCartModal(false)}>
                <Box
                    sx={{
                        backgroundColor: "#fff",
                        padding: "15px",
                        borderRadius: "8px",
                        maxWidth: "90vw",
                        height: "80vh",
                        margin: "10vh auto",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <CartSummary
                        cartItems={cartItems}
                        totalPrice={totalPrice}
                        handleEditItem={handleEditItem}
                        handleRemoveItem={handleRemoveItem}
                        onSave={handleSaveData}
                    />
                </Box>
            </Modal>
        )}
    </>
);

export default OrderCreate;
