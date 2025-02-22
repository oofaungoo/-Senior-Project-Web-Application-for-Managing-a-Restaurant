import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { MdFastfood } from "react-icons/md";
import { HiDocumentAdd, HiDocumentDuplicate, HiDocumentSearch, HiUserGroup, HiLogout, HiInbox, HiChevronLeft, HiChevronRight, HiBell } from 'react-icons/hi';
import { Grid } from '@mui/material';

const Sidebar = () => {
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState('');
    const [isExpanded, setIsExpanded] = useState(true);
    const [unreadNotifications, setUnreadNotifications] = useState(0); // Mock for unread notification count

    const adminMenu = [
        { to: '/OrderCreate', label: 'สร้างออเดอร์', icon: <HiDocumentAdd /> },
        { to: '/OrderCheck', label: 'ออร์เดอร์ปัจจุบัน', icon: <HiDocumentDuplicate /> },
        { to: '/OrderHistory', label: 'ประวัติออเดอร์', icon: <HiDocumentSearch /> },
        { to: '/IngredientManagement', label: 'จัดการวัตถุดิบ', icon: <HiInbox /> },
        { to: '/MenuManager', label: 'จัดการเมนูอาหาร', icon: <MdFastfood /> },
        { to: '/UserManager', label: 'จัดการผู้ใช้', icon: <HiUserGroup /> },
        { 
            to: '/Noti', 
            label: 'การแจ้งเตือน', 
            icon: <HiBell />,
            badge: unreadNotifications > 0, // Show badge if there are unread notifications
        }
    ];
 
    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        if (menu === 'การแจ้งเตือน') {
            setUnreadNotifications(0); // Mark all notifications as read when visiting the page
        }
    };

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    // Simulate fetching unread notifications from backend
    useEffect(() => {
        const fetchNotifications = () => {
            // Mock: Random unread notifications count
            const newUnreadCount = Math.floor(Math.random() * 10);
            setUnreadNotifications(newUnreadCount);
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Simulate periodic updates
        return () => clearInterval(interval);
    }, []);

    // Update active menu based on current URL
    useEffect(() => {
        const currentPath = location.pathname;
        const activeItem = adminMenu.find(item => item.to === currentPath);
        if (activeItem) {
            setActiveMenu(activeItem.label);
        }
    }, [location.pathname, adminMenu]);

    return (
        <Grid container spacing={0} style={{ height: '100vh' }}>
    {/* Sidebar */}
    <Grid item xs={isExpanded ? 2 : 1} style={{ transition: '0.3s' }}>
        <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`} id='sidebar'>
            <div className='sidebar-header'>
                <div className='fw-5 fs-24 text-blue' style={{ margin: '20px 0px' }}>
                    {isExpanded && "FoodMood."}
                </div>
                <button className="toggle-button" onClick={toggleSidebar}>
                    {isExpanded ? <HiChevronLeft /> : <HiChevronRight />}
                </button>
            </div>
            <ul>
                {adminMenu.map((item) => (
                    <Link to={item.to} key={item.label}>
                        <li 
                            className={`${activeMenu === item.label ? 'active' : ''} ${item.badge ? 'has-badge' : ''}`} 
                            onClick={() => handleMenuClick(item.label)}
                        >
                            {item.icon} 
                            {isExpanded && item.label}
                            {item.badge && <span className="badge">{unreadNotifications}</span>}
                        </li>
                    </Link>
                ))}
            </ul>
            <button className="sidebar-logout-button fs-16 text-white">
                <HiLogout className='icon' /> {isExpanded && 'ออกจากระบบ'}
            </button>
        </div>
    </Grid>

    {/* Main Content */}
    <Grid item xs={10} style={{ padding: '20px' }}>
        <div className="main-content">
            {/* คอนเทนต์ที่อยู่ตรงนี้ */}
        </div>
    </Grid>
</Grid>

    );
}

export default Sidebar;
