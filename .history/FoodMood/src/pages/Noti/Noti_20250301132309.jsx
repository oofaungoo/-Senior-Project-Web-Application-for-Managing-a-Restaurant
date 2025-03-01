import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Noti.css';

const Noti = ({ setUnreadNotifications, setLowStockItems }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {


    }, []);

    useEffect(() => {
        const fetchIngredients = async () => {
            axios.get('http://localhost:5000/api/ingredients')
                .then(res => { setIngredientOptions(res.data); })
                .catch(err => console.error('Error fetching ingredients:', err));

            setLowStockItems(lowStock);
            setUnreadNotifications(lowStock.length);

            const notiData = lowStock.map((item, index) => ({
                id: item._id,
                item: item.name,
                quantity: `${item.remain} ${item.unit}`,
                affectedMenus: "-",
                time: new Date().toLocaleString(),
                isNew: true,
            }));
            setNotifications(notiData);
        };
        fetchIngredients();
    }, [setUnreadNotifications, setLowStockItems]);

    return (
        <div className="middle-box">
            {notifications.length > 0 ? (
                notifications.map((noti) => (
                    <div key={noti.id} className={`notification ${noti.isNew ? 'new' : ''}`}>
                        <div className="notification-header">
                            {noti.isNew && <span className="notification-title-text fw-5">New</span>}
                            <span className="notification-time">{noti.time}</span>
                        </div>
                        <div className="notification-content">
                            วัตถุดิบ <span className="text-red">{noti.item}</span> เหลือเพียง
                            <span className="text-red"> {noti.quantity}</span>
                        </div>
                    </div>
                ))
            ) : (
                <p className="no-notifications">ไม่มีการแจ้งเตือน</p>
            )}
        </div>
    );
};

export default Noti;
