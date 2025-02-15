import React from 'react';
import './OrderDetail.css';
import Grid from '@mui/material/Grid';

const OrderDetail = ({ selectedOrder, handleEditItem, handleRemoveItem, onClose }) => {
    if (!selectedOrder) {
        return <p>ไม่มีข้อมูลออเดอร์</p>; // Show a message if no order is selected
    }

    const statusMap = {
        "ยังไม่เริ่ม": "รับออเดอร์",
        "กำลังทำ": "พร้อมเสิร์ฟ",
        "พร้อมเสิร์ฟ": "เสร็จสิ้น"
    };

    return (
        <div>
            {/* ปุ่มกากบาท (X) สำหรับปิด */}
            <button className="close-button fs-16" onClick={onClose}>X</button>

            <div className='right-box-header fs-26 fw-5 text-center'>
                ออเดอร์ที่ {selectedOrder.orderNumber}
            </div>
            <Grid container spacing={1} style={{ marginTop: "10px" }}>
                <Grid xs={12} >
                    <p style={{ fontSize: 18, fontWeight: 500, marginTop: "10px" }}>รายละเอียดออเดอร์:</p>
                </Grid>

                <Grid xs={12} style={{ display: "flex", justifyContent: "space-between" }}><p>สถานะ:</p><p>{selectedOrder.orderStatus}</p></Grid>
                <Grid xs={12} style={{ display: "flex", justifyContent: "space-between" }}>
                    <p>วัน/เวลา:</p>
                    <p>{selectedOrder.orderDate}</p>
                    <p>{selectedOrder.orderTime}</p>
                </Grid>
            </Grid>

            <div className='fs-18 fw-5' style={{ marginTop: "10px" }}>รายการอาหารที่สั่ง</div>
            <ul>
                {(selectedOrder?.orderItems || []).map((item, index) => ( // เปลี่ยนจาก items เป็น orderItems
                    <li className='cart-item-column' key={index}>
                        <div className="cart-item-details">
                            {/* แสดงจำนวนสินค้าในกล่องสี่เหลี่ยม */}
                            <span className="quantity-box">
                                {item.quantity}
                            </span>

                            {/* รายละเอียดของเมนู (ชื่อ, ขนาด, หมายเหตุ) */}
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
                                    {item.note && <div className='text-dark-grey'>หมายเหตุ: {item.note}</div>}
                                </div>
                            </div>

                            {/* ราคา */}
                            <span className="cart-item-price">{item.price * item.quantity}</span>
                        </div>
                    </li>
                ))}
            </ul>

            <div className='right-box-header'>
                <div className="total-price fs-18 fw-5">
                    <p>ราคารวม:</p>
                    <p>{selectedOrder.totalPrice}</p>
                </div>
                <p>{selectedOrder.orderType}</p>
            </div>


            {/* Fake Buttons */}
            <div className="order-action-buttons">
                <button className="red-button" onClick={() => handleRemoveItem(selectedOrder.id)}>
                    ยกเลิก
                </button>
                <button className="green-button" onClick={() => handleEditItem(selectedOrder.id)}>
                    {statusMap[selectedOrder.orderStatus] || "เสร็จสิ้น"}
                </button>
            </div>
        </div>
    );
};

export default OrderDetail;
