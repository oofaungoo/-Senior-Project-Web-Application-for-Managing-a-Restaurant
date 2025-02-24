import React, { useState, useEffect } from 'react';
import './Noti.css';

const Noti = () => {
    const [notifications, setNotifications] = useState([]);

    // Simulate fetching data from backend
    useEffect(() => {
        const fetchNotifications = async () => {
            const mockData = [
                {
                    id: 1,
                    item: "หมูสับ",
                    quantity: "50 g",
                    affectedMenus: "ผัดกะเพราหมู, ผัดซีอิ๊วหมู, ข้าวหน้าหมู",
                    time: "12:48 20/01/20025",
                    isNew: true,
                },
                {
                    id: 2,
                    item: "ไก่",
                    quantity: "30 g",
                    affectedMenus: "ผัดกะเพราไก่, ผัดซีอิ๊วไก่, ข้าวหน้าไก่",
                    time: "12:45 20/01/20025",
                    isNew: false,
                },
                {
                    id: 3,
                    item: "ปลาหมึก",
                    quantity: "หมด",
                    affectedMenus: "ผัดกะเพราปลาหมึก, ข้าวผัดปลาหมึก",
                    time: "12:40 20/01/20025",
                    isNew: false,
                },
            ];
            setNotifications(mockData);
        };

        fetchNotifications();
    }, []);

    return (
        <>
            <div className="middle-box">
                {notifications.map((noti) => (
                    <div
                        key={noti.id}
                        className={`notification ${noti.isNew ? 'new' : ''}`}
                    >
                        <div className="notification-header">
                            {noti.isNew && (
                                <span className="notification-title-text fw-5">New</span>
                            )}
                            <span className="notification-time">{noti.time}</span>
                        </div>
                        <div className="notification-content">
                            วัตถุดิบ <span className="text-red">{noti.item}</span> ในคลังคงเหลือน้อยกว่า
                            <span className="text-red"> {noti.quantity}</span> อาจส่งผลต่อเมนูต่อไปนี้
                            <span className="text-red"> {noti.affectedMenus}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Noti;
