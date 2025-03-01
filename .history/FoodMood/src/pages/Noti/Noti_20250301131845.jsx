import React, { useState, useEffect } from 'react';
import './Noti.css';

const Noti = ({ setUnreadNotifications, setLowStockItems }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/ingredients')
            .then(res => {
                const lowStock = res.data.filter(item => item.remain < item.min);
                setLowStockItems(lowStock);
                setUnreadNotifications(lowStock.length);

                const notiData = lowStock.map((item, index) => ({
                    id: index + 1,
                    item: item.name,
                    quantity: item.remain + ' ' + item.unit,
                    affectedMenus: "-", 
                    time: new Date().toLocaleTimeString(),
                    isNew: true,
                }));
                setNotifications(notiData);
            })
            .catch(err => console.error('Error fetching ingredients:', err));
    }, [setUnreadNotifications, setLowStockItems]);

    return (
        <div className="middle-box">
            {notifications.map((noti) => (
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
            ))}
        </div>
    );
};

export default Noti;
