import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderDetail.css';
import { Grid, Box, Stack } from "@mui/material";
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';

const OrderDetail = ({ selectedOrder, onClose, updateOrder }) => {
    const [categoryList, setCategoryList] = useState([]);
    const [filterCategory, setFilterCategory] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // API: Fetch data from database (1.Food category 2.Food size 3.Ingredient)
    useEffect(() => {
        // Food category
        axios.get('http://localhost:5000/api/add_menus/category')
            .then(res => { setCategoryList(res.data); })
            .catch(err => console.error('Error fetching categories:', err));
    }, []);


    const filteredItems = selectedCategory
        ? selectedOrder?.orderItems?.filter(item => item.category === selectedCategory)
        : selectedOrder?.orderItems || [];

    if (!selectedOrder) {
        return <p>ไม่มีข้อมูลออเดอร์</p>;
    }

    const statusMap = {
        "ยังไม่เริ่ม": "กำลังทำ",
        "กำลังทำ": "พร้อมเสิร์ฟ",
        "พร้อมเสิร์ฟ": "เสร็จสิ้น"
    };

    // API: Update order status (ทำการส่ง newStatus เข้ามาในฟังก์ชันแล้วอัปเดทไปที่ orders ที่มี _id ตรงกับ selectedOrder._id)
    const updateOrderStatus = (newStatus) => {
        axios.put(`http://localhost:5000/api/orders/${selectedOrder._id}`, { orderStatus: newStatus })
            .then(() => {
                updateOrder(selectedOrder._id, newStatus);
                Swal.fire({
                    title: "สำเร็จ!",
                    text: `ทำการเปลี่ยนสถานะเป็น "${newStatus}" แล้ว`,
                    icon: "success",
                    confirmButtonColor: "#64A2FF",
                    confirmButtonText: "โอเค"
                });
            })
            .catch(err => console.error('Error updating order status:', err));
    };

    return (
        <>
            <Grid container sx={{ borderBottom: "2px solid #ddd", paddingBottom: "8px", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Grid item>
                    <p style={{ fontSize: 26, fontWeight: 500, margin: 0 }}>ออเดอร์ที่ {selectedOrder.orderNumber}</p>
                </Grid>
                <CloseIcon style={{ fontSize: 18, color: "#ff4b4b", cursor: "pointer", position: "absolute", right: 0 }} onClick={onClose} />
            </Grid>

            <Grid container spacing={1} style={{ marginTop: "10px" }} paddingBottom="8px" marginBottom="8px" borderBottom="1px solid #ddd">
                <Grid item xs={12}>
                    <p style={{ fontSize: 18, fontWeight: 500 }}>รายละเอียดออเดอร์:</p>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "space-between" }}>
                    <p>สถานะ:</p>
                    <p>{selectedOrder.orderStatus}</p>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "space-between" }}>
                    <p>วัน/เวลา:</p>
                    <p>{selectedOrder.orderDate}</p>
                    <p>{selectedOrder.orderTime}</p>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "space-between" }}>
                    <p>ผู้รับออเดอร์:</p>
                    <p>{selectedOrder.employeeName}</p>
                </Grid>
            </Grid>

            <p style={{ fontSize: 18, fontWeight: 500 }}>รายการอาหารที่สั่ง</p>

            {/* ฟิลเตอร์เลือกหมวดหมู่ */}
            {/* Scrollable Button Container */}
            {/* Filter Bubble Container */}
            <div className="filter-bubble-container" style={{ marginTop: "10px", overflowX: "auto", whiteSpace: "nowrap" }}>
                หมวดหมู่:
                <div style={{ display: "inline-flex", gap: "8px" }}>
                    {/* Bubble ALL */}
                    <div
                        className={`filter-bubble ${filterCategory === "" ? "active" : ""}`}
                        onClick={() => setFilterCategory("")}
                    >
                        ALL
                    </div>

                    {/* Bubble Categories */}
                    {categoryList.map((category) => (
                        <div
                            key={category.id}
                            className={`filter-bubble ${filterCategory === category.name ? "active" : ""}`}
                            onClick={() => setFilterCategory(category.name)}
                        >
                            {category.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* รายการอาหารที่ถูกกรอง */}
            <Grid container direction="column">
                {filteredItems.map((item, index) => (
                    <Grid key={index} sx={{ borderBottom: "1px solid #ddd", marginTop: "8px" }}>
                        <Grid container spacing={2} alignItems="center">
                            {/* จำนวนสินค้า */}
                            <Grid item xs={2} sx={{ display: "flex", justifyContent: "center" }}>
                                <Box sx={{
                                    backgroundColor: "#F2F2F2",
                                    border: "1px solid #ddd",
                                    padding: "4px 12px",
                                    borderRadius: "4px",
                                    textAlign: "center",
                                }}>
                                    {item.quantity}
                                </Box>
                            </Grid>

                            {/* ชื่อสินค้า + ตัวเลือก */}
                            <Grid item xs={8}>
                                <p>{item.name}</p>
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
                                </div>
                            </Grid>

                            {/* ราคาสินค้าอยู่ขวาสุด */}
                            <Grid item xs={2} sx={{ textAlign: "right", fontSize: "16px", ml: "auto" }}>
                                {item.price * item.quantity} ฿
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
            </Grid>


            <Grid mt={2}>
                {statusMap[selectedOrder.orderStatus] && (
                    <Button variant="contained" color="primary" onClick={() => updateOrderStatus(statusMap[selectedOrder.orderStatus])}>
                        {statusMap[selectedOrder.orderStatus]}
                    </Button>
                )}

                {selectedOrder.orderStatus !== "เสร็จสิ้น" && selectedOrder.orderStatus !== "ยกเลิก" && (
                    <Button variant="contained" color="secondary" onClick={() => updateOrderStatus("ยกเลิก")}>
                        ยกเลิกออเดอร์
                    </Button>
                )}
            </Grid>
        </>
    );
};

export default OrderDetail;
