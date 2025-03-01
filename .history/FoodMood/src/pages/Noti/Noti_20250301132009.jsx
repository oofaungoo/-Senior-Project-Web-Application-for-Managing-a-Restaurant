import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
            <ul>
                {adminMenu.map((item, index) => (
                    <li key={index}>
                        <Link to={item.to} className="sidebar-link">
                            {item.icon}
                            <span>{item.label}</span>
                            {item.badge > 0 && <span className="badge">{item.badge}</span>}
                        </Link>
                    </li>
                ))}
            </ul>
            {lowStockItems.length > 0 && (
                <div className="low-stock-container">
                    <h4>วัตถุดิบใกล้หมด</h4>
                    <ul>
                        {lowStockItems.map((item, index) => (
                            <li key={index}>{item.name} เหลือ {item.remain} {item.unit}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Noti;
