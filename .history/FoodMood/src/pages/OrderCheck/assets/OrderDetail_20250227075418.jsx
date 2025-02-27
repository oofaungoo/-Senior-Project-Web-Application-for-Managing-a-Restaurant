import React from 'react';
import axios from 'axios';
import './OrderDetail.css';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';

const OrderDetail = ({ selectedOrder, onClose, updateOrder }) => {
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
                    confirmButtonText: "โอเค"
                });
            })
            .catch(err => console.error('Error updating order status:', err));
    };

    return (
        <div className='right-box'>
            <button className="close-button fs-16" onClick={onClose}>X</button>
            <div className='right-box-header fs-26 fw-5 text-center'>
                ออเดอร์ที่ {selectedOrder.orderNumber}
            </div>
            <Grid container spacing={1} style={{ marginTop: "10px" }}>
                <Grid item xs={12}>
                    <p style={{ fontSize: 18, fontWeight: 500, marginTop: "10px" }}>รายละเอียดออเดอร์:</p>
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
            </Grid>

            <div className='fs-18 fw-5' style={{ marginTop: "10px" }}>รายการอาหารที่สั่ง</div>
            <ul>
                {(selectedOrder?.orderItems || []).map((item, index) => (
                    <li className='cart-item-column' key={index}>
                        <div className="cart-item-details">
                            <span className="quantity-box">{item.quantity}</span>
                            <div className="item-info">
                                <div className="item-name">{item.name}</div>
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
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
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
            </div>
        </div>
    );
};

export default OrderDetail;
