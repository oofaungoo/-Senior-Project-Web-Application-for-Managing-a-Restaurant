import React, { useState, useEffect } from 'react';
import { FaRegTrashAlt } from "react-icons/fa";
import { Grid, Box } from '@mui/system';
import Swal from 'sweetalert2';

const CartSummary = ({ cartItems, totalPrice, handleEditItem, handleRemoveItem, onSave }) => {
    const [paidOption, setPaidOption] = useState('ยังไม่ระบุ');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const [orderNumber, setOrderNumber] = useState(null);

    useEffect(() => {
        const fetchLatestOrderNumber = async () => {
            try {
                const todayDate = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY
                const response = await fetch('http://localhost:5000/api/orders'); // เรียก API ดึงข้อมูลออเดอร์ทั้งหมด
                const orders = await response.json();

                // หาออเดอร์ล่าสุดของวันนั้น ๆ
                const todayOrders = orders.filter(order => order.orderDate === todayDate);
                const latestOrder = todayOrders.sort((a, b) => b.orderNumber - a.orderNumber)[0];

                setOrderNumber(latestOrder ? latestOrder.orderNumber + 1 : 1);
            } catch (error) {
                console.error('ไม่สามารถ fecth ข้อมูลจาก databaseได้:', error);
            }
        };

        fetchLatestOrderNumber();
    }, []);

    const handlePaidOptionChange = (e) => {
        setPaidOption(e.target.value);
        setPhoneNumber('');
        setTableNumber('');
    };

    const isDineIn = paidOption === 'ทานที่ร้าน';

    const handleSave = () => {
        const newOrder = {
            orderNumber,
            employeeName: "Tester404",
            items: cartItems,
            total: totalPrice,
            orderType: paidOption,
            contactInfo: isDineIn ? { tableNumber } : { phoneNumber },
        };
        onSave(newOrder);
    };

    return (
        <>
            <Grid container sx={{ borderBottom: "2px solid #ddd", marginBottom: "8px", paddingBottom: "8px", justifyContent: "center", display: "flex" }}>
                <p style={{ fontSize: 26, fontWeight: 500 }}>สร้างออเดอร์</p>
            </Grid>
            <p style={{ marginTop: "10px", fontSize: 18, fontWeight: 500 }}>รายการอาหารที่สั่ง</p>

            <Grid>
                {cartItems.map((item, index) => (
                    <Grid key={index} sx={{ borderBottom: "1px solid #ddd", marginTop: "8px" }}>
                        <Grid container spacing={2} justifyContent="flex-start">
                            {/* จำนวนสินค้า */}
                            <Grid item xs={1}>
                                <Box sx={{ backgroundColor: "#F2F2F2", border: "1px solid #ddd", padding: "2px 10px", borderRadius: "4px", textAlign: "center" }}>
                                    {item.quantity}
                                </Box>
                            </Grid>

                            {/* ชื่อสินค้า + ตัวเลือก */}
                            <Grid item xs={9} >
                                <div>{item.name}</div>
                                <div className="item-size-note fs-14">
                                    {item.size}
                                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                        <div className="selected-options">
                                            <ul>
                                                {Object.entries(item.selectedOptions).map(([label, option]) => (
                                                    <li key={label}>{label}: {option}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {item.note && <div className='text-dark-grey'>หมายเหตุ: {item.note}</div>}
                                </div>
                            </Grid>

                            {/* ราคาสินค้าอยู่ขวาสุด */}
                            <Grid item xs={2} sx={{ textAlign: "right", fontSize: "16px", ml: "auto" }}>
                                {item.price * item.quantity}
                            </Grid>
                        </Grid>

                        <Grid container xs={12} alignItems="center" justifyContent="space-between">
                            {/* ปุ่มแก้ไข อยู่ซ้าย */}
                            <Grid item marginLeft="38px">
                                <button onClick={() => handleEditItem(index)} className='text-blue invisible-btn fs-14 fw-5'>
                                    แก้ไข
                                </button>
                            </Grid>

                            {/* ปุ่มถังขยะ อยู่ขวาสุด */}
                            <Grid item sx={{ ml: "auto" }}>
                                <button onClick={() => handleRemoveItem(index)} className='text-red invisible-btn fs-14 fw-5'>
                                    <FaRegTrashAlt />
                                </button>
                            </Grid>
                        </Grid>

                    </Grid>
                ))}
            </Grid>

            <Grid sx={{ borderBottom: "1px solid #ddd", marginBottom: "8px" }}>
                <div className="total-price fs-18 fw-5">
                    <span>ราคารวม ({cartItems.length} รายการ):</span>
                    <span className='right'>{totalPrice}</span>
                </div>
            </Grid>
            <Grid marginTop="auto">
                <Grid sx={{ marginBottom: "8px", height: "164px" }}>
                    <label>ตัวเลือกการรับอาหาร: </label>
                    <select value={paidOption} onChange={handlePaidOptionChange}>
                        <option value="ยังไม่ระบุ">ยังไม่ระบุ</option>
                        <option value="ทานที่ร้าน">🍽️ ทานที่ร้าน</option>
                        <option value="กลับบ้าน">🏠 กลับบ้าน</option>
                        <option value="Delivery">🚚 Delivery</option>
                        <option value="สั่งแบบไม่ต้องจ่าย">🎉 สั่งแบบไม่ต้องจ่าย</option>
                    </select>
                    {paidOption !== 'ยังไม่ระบุ' && (
                        <div style={{ marginTop: "10px" }}>
                            <label>{isDineIn ? "หมายเลขโต๊ะ: " : "เบอร์โทร (หรือชื่อลูกค้า): "}</label>
                            <input
                                type="text"
                                value={isDineIn ? tableNumber : phoneNumber}
                                onChange={(e) => isDineIn ? setTableNumber(e.target.value) : setPhoneNumber(e.target.value)}
                                placeholder={isDineIn ? "ระบุหมายเลขโต๊ะ" : "ระบุเบอร์โทร (หรือชื่อลูกค้า)"}
                            />
                        </div>
                    )}
                </Grid>

                <Grid display="flex" justifyContent="space-between" borderTop="1px solid #ddd" sx={{ paddingTop: "8px", justifyContent: "center", display: "flex" }}>
                    <button className="blue-button" onClick={handleSave}>ยืนยันการสั่ง</button>
                </Grid>
            </Grid>

        </>
    );
};

export default CartSummary;
