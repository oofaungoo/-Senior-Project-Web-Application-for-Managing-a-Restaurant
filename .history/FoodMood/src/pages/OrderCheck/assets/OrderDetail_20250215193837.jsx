import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import './OrderDetail.css';

const OrderDetail = ({ selectedOrder, handleEditItem, handleRemoveItem, onClose }) => {
    if (!selectedOrder) {
        return <p>ไม่มีข้อมูลออเดอร์</p>; // Show a message if no order is selected
    }

    return (
        <div>
            {/* ปุ่มกากบาท (X) สำหรับปิด */}
            <button className="close-button fs-16" onClick={onClose}>X</button>

            <div className='right-box-header fs-26 fw-5 text-center'>
                ออเดอร์ที่ {selectedOrder.orderNumber}
            </div>
            <div className='right-box-header'>
                <div className='fs-18 fw-5' style={{ marginTop: "10px" }}>รายละเอียดการสั่ง</div>
                <div>สถานะ: {
                    selectedOrder.status === 1 ? 'ยังไม่เริ่ม' :
                    selectedOrder.status === 2 ? 'กำลังทำ' :
                    selectedOrder.status === 3 ? 'พร้อมเสิร์ฟ' :
                    selectedOrder.status === 4 ? 'เสร็จสิ้น' :
                    'ยกเลิก'
                }</div>
                <div>วันที่: {selectedOrder.date}</div>
                <div>เวลาที่สั่ง: {selectedOrder.time}</div>
            </div>

            <div className='fs-18 fw-5' style={{ marginTop: "10px" }}>รายการอาหารที่สั่ง</div>
            <ul>
                {(selectedOrder.items || []).map((item, index) => ( // Default to empty array
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
                                    {item.note && <div className='text-dark-grey'>หมายเหตุ: {item.note.join(', ')}</div>}
                                </div>
                            </div>

                            {/* ราคา */}
                            <span className="cart-item-price">{item.price * item.quantity}</span>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Fake Buttons */}
            <div className="order-action-buttons">
                <button className="red-button" onClick={() => handleRemoveItem(selectedOrder.id)}>
                    ยกเลิก
                </button>
                <button className="green-button" onClick={() => handleEditItem(selectedOrder.id)}>
                    พร้อมเสิร์ฟ
                </button>
            </div>
        </div>
    );
};

export default OrderDetail;
