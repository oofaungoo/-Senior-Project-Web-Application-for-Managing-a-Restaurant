import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import { HiChevronLeft, HiChevronRight, } from 'react-icons/hi';
import { Drawer, Box, Typography, IconButton } from '@mui/material';



import FastfoodRoundedIcon from '@mui/icons-material/FastfoodRounded';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import FindInPageRoundedIcon from '@mui/icons-material/FindInPageRounded';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import FileCopyRoundedIcon from '@mui/icons-material/FileCopyRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';

const Sidebar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);

    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState('');
    const [isExpanded, setIsExpanded] = useState(true);
    const [unreadNotifications, setUnreadNotifications] = useState(0); // Mock for unread notification count

    const adminMenu = [
        { to: '/OrderCreate', label: 'สร้างออเดอร์', icon: <NoteAddRoundedIcon /> },
        { to: '/OrderCheck', label: 'ออร์เดอร์ปัจจุบัน', icon: <FileCopyRoundedIcon /> },
        { to: '/OrderHistory', label: 'ประวัติออเดอร์', icon: <FindInPageRoundedIcon /> },
        { to: '/IngredientManagement', label: 'จัดการวัตถุดิบ', icon: <InboxRoundedIcon /> },
        { to: '/MenuManager', label: 'จัดการเมนูอาหาร', icon: <FastfoodRoundedIcon /> },
        { to: '/UserManager', label: 'จัดการผู้ใช้', icon: <PeopleAltRoundedIcon /> },
        { 
            to: '/Noti', 
            label: 'การแจ้งเตือน', 
            icon: <NotificationsActiveRoundedIcon />,
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
        <>
        <Drawer anchor='left' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
            <Box p={2} width='250px' role='presentation'>

            </Box>
        
        </Drawer>
        
        </>
        
    );
}

export default Sidebar;

{/* 
  <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`} id='sidebar'>
            <div className='sidebar-header'>
                <div className='fw-5 fs-20 text-blue' style={{ margin: '20px 0px 20px 0px' }}>
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
                <LogoutRoundedIcon className='icon' /> {isExpanded && 'ออกจากระบบ'}
            </button>
        </div>  
*/}