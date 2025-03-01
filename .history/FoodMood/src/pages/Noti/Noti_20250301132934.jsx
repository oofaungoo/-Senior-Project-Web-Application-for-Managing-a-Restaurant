import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Noti.css';

const Noti = ({ setUnreadNotifications = () => {}, setLowStockItems = () => {} }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/ingredients');
                const ingredients = res.data;

                const lowStock = ingredients.filter(item => item.remain < item.min);

                setLowStockItems(lowStock);
                setUnreadNotifications(lowStock.length);

                const notiData = lowStock.map(item => ({
                    id: item._id,
                    item: item.name,
                    remain: `${item.remain} ${item.unit}`,
                    min: `${item.min} ${item.unit}`,
                    time: new Date().toLocaleString(),
                    isNew: true,
                }));

                setNotifications(notiData);
            } catch (err) {
                console.error('Error fetching ingredients:', err);
            }
        };

        fetchIngredients();
    }, [setUnreadNotifications, setLowStockItems]);

    return (
        <Box
                sx={{
                    backgroundColor: "#fff",
                    width: "100%",
                    height: "100vh",
                    padding: "20px",
                    borderRadius: "8px",
                    overflowY: "auto",
                    marginRight: "10px",
                }}
            >
            {notifications.length > 0 ? (
                notifications.map((noti) => (
                    <div key={noti.id} className={`notification ${noti.isNew ? 'new' : ''}`}>
                        <div className="notification-header">
                            {noti.isNew && <span className="notification-title-text fw-5">New</span>}
                            <span className="notification-time">{noti.time}</span>
                        </div>
                        <div className="notification-content">
                            วัตถุดิบ <span className="text-red">{noti.item}</span> เหลือเพียง
                            <span className="text-red"> {noti.remain}</span> จากจำนวนขั้นต่ำ <span className="text-red"> {noti.min}</span>
                        </div>
                    </div>
                ))
            ) : (
                <p className="no-notifications">ไม่มีการแจ้งเตือน</p>
            )}
        </Box>
    );
};

export default Noti;
