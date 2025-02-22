import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Button, Drawer, IconButton, useMediaQuery } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import FileCopyRoundedIcon from '@mui/icons-material/FileCopyRounded';
import FindInPageRoundedIcon from '@mui/icons-material/FindInPageRounded';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import FastfoodRoundedIcon from '@mui/icons-material/FastfoodRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const Sidebar = ({ unreadNotifications }) => {
    const location = useLocation();
    const isSmallScreen = useMediaQuery('(max-width: 768px)'); // For mobile user
    const [isDrawerOpen, setIsDrawerOpen] = useState(!isSmallScreen); // For computer & tablet user
    const [isCollapsed, setIsCollapsed] = useState(false); // ควบคุมการย่อ/ขยายของ sidebar
    const [activeMenu, setActiveMenu] = useState('');
    const [isHovered, setIsHovered] = React.useState(false);

    useEffect(() => {
        if (isSmallScreen) {
            setIsDrawerOpen(false);
        } else {
            setIsDrawerOpen(true);
        }
    }, [isSmallScreen]);

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
            badge: unreadNotifications > 0,
        }
    ];

    return (
        <>
            {/* (Mobile) Menu collapse button */}
            {isSmallScreen && (
                <IconButton size='large' edge='start' aria-label='menu' onClick={() => setIsDrawerOpen(true)}>
                    <MenuRoundedIcon />
                </IconButton>
            )}

            <Drawer
                variant={isSmallScreen ? 'temporary' : 'permanent'}     // 📱ใช้ temporary, 🖥️ใช้ permanent
                anchor="left"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                sx={{
                    width: isCollapsed ? 80 : 220,
                    flexShrink: 0,
                    marginRight: !isSmallScreen ? '10px' : 0,           // 🖥️ เพิ่ม marginRight เพื่อให้ content ด้านขวามือติดขอบ
                    '& .MuiDrawer-paper': {
                        width: isCollapsed ? 80 : 220,
                        transition: 'width 0.3s',
                        marginRight: !isSmallScreen ? '10px' : 0,       // ทำเหมือนด้านบน ซึ่งจะต้องกำหนดเหมือนกัน (เป็น default การเขียน Drawer ของ MUI)
                    }
                }}
            >
                <Box p={2} sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: isCollapsed ? 'center' : 'flex-start', }}>

                    {/* (PC) Menu collapse button */}
                    {!isSmallScreen && (
                        <IconButton sx={{ marginBottom: "10px" }} onClick={() => setIsCollapsed(!isCollapsed)}>
                            {isCollapsed ? <MenuRoundedIcon /> : <MenuOpenRoundedIcon />}
                        </IconButton>
                    )}

                    {/* Navigator menu */}
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {adminMenu.map((item) => (
                            <Link to={item.to} key={item.label}>
                                <li
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '10px 16px',
                                        marginBottom: '10px',
                                        borderRadius: '26px',
                                        backgroundColor: activeMenu === item.label ? '#64A2FF' : 'transparent',
                                        color: activeMenu === item.label ? '#fff' : '#777777',
                                        cursor: 'pointer',
                                        transition: '0.3s',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e0e7ff'; e.currentTarget.style.color = '#007bff'; }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = activeMenu === item.label ? '#64A2FF' : 'transparent';
                                        e.currentTarget.style.color = activeMenu === item.label ? '#fff' : '#777777';
                                    }}
                                    onClick={() => setActiveMenu(item.label)}
                                >
                                    {item.icon}
                                    {!isCollapsed && <span style={{ marginLeft: 10 }}>{item.label}</span>}
                                    {item.badge && <span className="badge">{unreadNotifications}</span>}
                                </li>
                            </Link>
                        ))}
                    </ul>

                    {/* Logout button */}
                    <Button 
                        sx={{display: 'flex', alignItems: 'center', padding: '10px 16px', borderRadius: '26px', backgroundColor:"#ff7878", color: '#fff',transition: '0.3s'}}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ff4b4b'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ff7878'; }}
                    >
                        <LogoutRoundedIcon />ออกจากระบบ
                    </Button>
                    
                </Box>
            </Drawer>
        </>
    );
};

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