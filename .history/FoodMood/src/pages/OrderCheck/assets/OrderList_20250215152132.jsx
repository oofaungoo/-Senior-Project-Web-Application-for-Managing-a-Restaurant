import React from 'react';

const OrderList = ({ orders, selectOrder }) => {
    return (
        <div className="order-list">
            {orders.length > 0 ? (
                orders.map((order) => (
                    <div
                        key={order.id}
                        className={`order-item status-${order.status}`}
                        onClick={() => selectOrder(order)}
                    >
                        <div className="right-box-header fs-20 fw-5 text-center">
                            ออเดอร์ที่ {order.id} (โต๊ะ: {order.table})
                        </div>
                        <div>สถานะ: {order.status}</div>
                        <div>วันที่: {order.date}</div>
                        <div>เวลา: {order.time}</div>
                    </div>
                ))
            ) : (
                <p>ไม่พบออเดอร์</p>
            )}
        </div>
    );
};

export default OrderList;
