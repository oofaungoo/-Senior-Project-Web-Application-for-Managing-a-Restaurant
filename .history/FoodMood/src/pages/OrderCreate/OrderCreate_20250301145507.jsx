import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Modal, useMediaQuery } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuList_Order from './assets/MenuList_Order';
import MenuItemSelected from './assets/MenuItemSelected';
import CartSummary from './assets/CartSummary';
import './OrderCreate.css';
import Swal from 'sweetalert2';

{/* Bug check 
    1. เวลากดปิด onClose MenuItemSelected แล้ว มันหายไปจาก CartSummary เลย
    2. แก้ไขหน้า CartSummary ให้สวยด้วย
    3. เพิ่ม "ชื่อผู้สั่ง" เข้าไปใน database ด้วย    
*/}

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
    const [formMode, setFormMode] = useState("Add");
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [note, setNote] = useState('');

    const [ingredientRemain, setIngredientRemain] = useState([]);
    const [ingredientChange, setIngredientChange] = useState([]);

    // API: Fetch data from database
    useEffect(() => {

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in first");
            return;
        }

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
            })
            .catch(err => console.error('Error fetching :', err));
    }, []);

    //API: Add New Order
    const handleSaveData = async (orderData) => {
        console.log("ข้อมูลออเดอร์ที่ได้รับ:", orderData);

        // ตรวจสอบว่ามีเมนูในตะกร้าหรือไม่
        if (!orderData?.items || orderData.items.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "ไม่สามารถสร้างออเดอร์ได้",
                text: "กรุณาเพิ่มเมนูลงในตะกร้าก่อน",
                confirmButtonColor: "#64A2FF",
                confirmButtonText: "ตกลง"
            });
            return;
        }

        // ตรวจสอบว่าเลือกตัวเลือกการรับประทานหรือยัง
        if (!orderData?.orderType || orderData.orderType === "ยังไม่ระบุ") {
            Swal.fire({
                icon: "warning",
                title: "กรุณาเลือกตัวเลือกการรับประทาน",
                text: "คุณต้องเลือกตัวเลือก เช่น ทานที่ร้าน หรือ สั่งกลับบ้าน",
                confirmButtonColor: "#64A2FF",
                confirmButtonText: "ตกลง"
            });
            return;
        }

        // ตรวจสอบว่ากรอกเบอร์โทรหรือเลขโต๊ะหรือยัง
        const contactInfo = orderData?.contactInfo || {};
        const hasPhoneNumber = contactInfo.phoneNumber && contactInfo.phoneNumber.trim() !== "";
        const hasTableNumber = contactInfo.tableNumber && contactInfo.tableNumber.trim() !== "";

        if (!hasPhoneNumber && !hasTableNumber) {
            console.log("❌ ไม่มีเบอร์โทรหรือเลขโต๊ะ ข้อมูลไม่ควรถูกบันทึก");
            Swal.fire({
                icon: "warning",
                title: "กรุณากรอกเบอร์โทรหรือเลขโต๊ะ",
                text: "ข้อมูลนี้จำเป็นต้องใช้สำหรับการบันทึกออเดอร์",
                confirmButtonColor: "#64A2FF",
                confirmButtonText: "ตกลง"
            });
            return;
        }

        try {
            console.log("✅ ขั้นตอนสุดท้าย ฉันกำลังจะนำเข้าข้อมูล : ", orderData);
            console.log("✅ ขั้นตอนสุดท้าย ฉันกำลังจะหักวัตถุดิบ : ", ingredientRemain);

            const response = await axios.post('http://localhost:5000/api/orders', orderData);

            // อัปเดตวัตถุดิบเฉพาะที่มีการเปลี่ยนแปลง
            await Promise.all(
                ingredientChange.map(async (acc) => {
                    await axios.put(`http://localhost:5000/api/ingredients/${acc._id}`, acc);
                })
            );

            console.log('✅ Order saved:', response.data);

            setCartItems([]); // ✅ ล้างตะกร้าหลังบันทึกสำเร็จ
            Swal.fire({
                icon: "success",
                title: "บันทึกออเดอร์สำเร็จ",
                confirmButtonColor: "#64A2FF",
                confirmButtonText: "โอเค"
            }).then(() => {
                window.location.reload(); // ✅ รีเฟรชหน้าจอ
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถสร้างออเดอร์ได้ กรุณาลองใหม่",
                confirmButtonColor: "#64A2FF",
                confirmButtonText: "โอเค"
            });
        }
    };


    // Function: Handle Menu Click & Set default for every option that exists.
    const handleMenuClick = (item) => {
        setSelectedItem(item);
        setSelectedSize(item.sizePrices[0].size);
        setFormMode("Add");  // 🆕 ตั้งค่าเป็น Add เมื่อเลือกเมนูใหม่
        if (isMobile) { setShowSelectedMenu(true); }
    };

    // Fuction: Change size in MenuItemSelected.jsx
    const handleSizeChange = (size) => { setSelectedSize(size); };

    // Fuction: Handle Quantity Change (Increase & Decrease, in order) in MenuItemSelected.jsx
    const handleQuantityIncrease = () => { setQuantity((prevQuantity) => prevQuantity + 1); };
    const handleQuantityDecrease = () => { setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1)); };

    // Function: Add item to cart (from MenuItemSelected.jsx ---> to CartSummary.jsx)
    const handleConfirmAdd = () => {
        const selectedSizeData = selectedItem.sizePrices.find(s => s.size === selectedSize);

        console.log("ฉันกำลังเพิ่มเมนู : ", selectedSizeData);
        console.log("หลังจากเพิ่มเมนูแล้ว : ", ingredientRemain);

        // อัปเดตค่า remain ของ ingredientRemain
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

        // คัดเฉพาะวัตถุดิบที่มีการเปลี่ยนแปลงจริง ๆ
        const IngredientChangefilter = ingredientProcess.filter((acc, index) => {
            const changeItem = ingredientChange?.[index] ?? {};
            return acc.remain !== changeItem.remain;
        });

        console.log("วัตถุดิบที่ถูกเปลี่ยนแปลง : ", IngredientChangefilter);

        setIngredientChange(IngredientChangefilter);
        setIngredientRemain(ingredientProcess);  // ✅ เพิ่มบรรทัดนี้เพื่อให้ ingredientRemain เปลี่ยนแปลงจริง ๆ

        const newItem = {
            name: selectedItem.name,
            category: selectedItem.category,
            size: selectedSize,
            price: selectedSizeData.price,
            quantity: quantity,
            note: note,
            selectedOptions: selectedOptions,
        };

        console.log("ฉันเพิ่มเมนู : ", newItem);

        setCartItems(prevCartItems => [...prevCartItems, newItem]);

        setSelectedItem(null);
        setQuantity(1);
        setSelectedSize('');
        setSelectedOptions({});
        setNote('');
    };

    // Function: Remove Item (from cart)
    const handleRemoveItem = (indexToRemove) => { setCartItems(cartItems.filter((_, index) => index !== indexToRemove)); };

    // Function: Edit Item (in cart)
    const handleEditItem = (indexToEdit) => {
        const itemToEdit = cartItems[indexToEdit];
        const originalMenuItem = data.find(menu => menu.name === itemToEdit.name);

        setSelectedItem({
            ...originalMenuItem,
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
        setFormMode("Edit");  // 🆕 ตั้งค่าเป็น Edit เมื่อกดแก้ไข

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
                    marginBottom: isMobile ? "80px" : "0"
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
                            formMode={formMode} // 🆕 ส่งค่า formMode ไป
                            onClose={() => {
                                console.log("Closing MenuItemSelected...");
                                setSelectedItem(null);
                            }}
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
                                formMode={formMode} // 🆕 ส่งค่า formMode ไป
                                onClose={() => {
                                    console.log("Closing MenuItemSelected...");
                                    setSelectedItem(null);
                                }}
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
                        backgroundColor: "#64A2FF",
                        color: "#fff",
                        textAlign: "center",
                        justifyContentL: "center",
                        padding: "15px",
                        fontSize: "18px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onClick={() => setShowCartModal(true)}
                >
                    <ShoppingCartIcon /> <span style={{ marginLeft: "8px" }}>ตะกร้าของฉัน ({cartItems.length} รายการ)</span>
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
};

export default OrderCreate;
