import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Noti.css';

const Noti = ({ setUnreadNotifications, setLowStockItems }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/ingredients');
                const ingredients = res.data;
    
                setIngredientOptions(ingredients);
    
                // กรองเฉพาะวัตถุดิบที่ต่ำกว่าขั้นต่ำ
                const lowStock = ingredients.filter(item => item.remain < item.min);
    
                // อัปเดต state ของ Sidebar และ Noti
                setLowStockItems(lowStock);
                setUnreadNotifications(lowStock.length);
    
                // สร้างข้อมูลแจ้งเตือน
                const notiData = lowStock.map(item => ({
                    id: item._id,
                    item: item.name,
                    quantity: `${item.remain} ${item.unit}`,
                    affectedMenus: "-",
                    time: new Date().toLocaleString(),
                    isNew: true,
                }));
    
                setNotifications(notiData);
            } catch (err) {
                console.error('Error fetching ingredients:', err);
            }
        };
    
        fetchIngredients();
    }, [setUnreadNotifications, setLowStockItems, setIngredientOptions]);
    

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
