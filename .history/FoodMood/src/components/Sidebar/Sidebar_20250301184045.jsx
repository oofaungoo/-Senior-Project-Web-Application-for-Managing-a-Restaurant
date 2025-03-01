import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Drawer, IconButton, useMediaQuery, Badge } from '@mui/material';
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

const Sidebar = ({ unreadNotifications, lowStockItems }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery('(max-width: 768px)'); // For mobile user
    const [isDrawerOpen, setIsDrawerOpen] = useState(!isSmallScreen); // For computer & tablet user
    const [isCollapsed, setIsCollapsed] = useState(false); // ควบคุมการย่อ/ขยายของ sidebar
    const [activeMenu, setActiveMenu] = useState('');

    // Auto Funcion: set "isDrawerOpen" for desktop and mobile, respectively.
    useEffect(() => {
        if (isSmallScreen) { setIsDrawerOpen(false); }         // Mobile = false: close drawer at start.
        else { setIsDrawerOpen(true); }          // Desktop = true: open drawer at start.
    }, [isSmallScreen]);

    // Auto Function: select the menu that user are in at this moment.
    useEffect(() => {
        const currentMenu = adminMenu.find(item => item.to === location.pathname);
        if (currentMenu) { setActiveMenu(currentMenu.label); }
    }, [location.pathname]);

    // Constant Data: menu list for navigate.
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
            badge: unreadNotifications,
        }
    ];

    // Function: Logout
    const handleLogout = useCallback(() => {
        Swal.fire({
            title: 'ต้องการออกจากระบบ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff7878',
            cancelButtonColor: '#B2B2B2',
            confirmButtonText: 'ออกจากระบบ',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                navigate('/');
            }
        });
    }, [navigate]);


    return (
        <>
            {/* (Mobile) Menu collapse button */}
            {isSmallScreen && (
                <IconButton
                    size='large'
                    edge='start'
                    aria-label='menu'
                    onClick={() => setIsDrawerOpen(true)}
                    sx={{ display: 'flex', alignItems: 'center' }} // ✅ จัดเรียงแนวนอน
                >
                    <MenuRoundedIcon />
                </IconButton>
            )}

            <Drawer
                variant={isSmallScreen ? 'temporary' : 'permanent'}
                anchor="left"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                sx={{
                    height: '100vh',
                    width: isSmallScreen ? 190 : isCollapsed ? 70 : 190,
                    flexShrink: 0,
                    marginRight: !isSmallScreen ? '10px' : 0,
                    '& .MuiDrawer-paper': {
                        width: isSmallScreen ? 190 : isCollapsed ? 70 : 190,
                        transition: 'width 0.3s',
                        marginRight: !isSmallScreen ? '10px' : 0,
                    }
                }}
            >
                <Box
                    p={1}
                    sx={{
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center', // ✅ บังคับให้ปุ่มเมนูอยู่ตรงกลางเสมอ
                        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
                    }}
                >

                    {/* (PC) Menu collapse button */}
                    {!isSmallScreen && (
                        <IconButton sx={{ marginBottom: "10px" }} onClick={() => setIsCollapsed(!isCollapsed)}>
                            {isCollapsed ? <MenuRoundedIcon /> : <MenuOpenRoundedIcon />}
                        </IconButton>
                    )}

                    {/* Navigator menu */}
                    <ul>
                        {adminMenu.map((item) => (
                            <Link to={item.to} key={item.label}>
                                <li
                                    style={{
                                        display: 'flex',
                                        width: "100%",
                                        alignItems: 'center',
                                        padding: '10px 16px',
                                        marginBottom: '10px',
                                        borderRadius: '26px',
                                        backgroundColor: activeMenu === item.label ? '#64A2FF' : 'transparent',
                                        color: activeMenu === item.label ? '#fff' : '#777777',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s, color 0.3s',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e0e7ff'; e.currentTarget.style.color = '#007bff'; }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = activeMenu === item.label ? '#64A2FF' : 'transparent';
                                        e.currentTarget.style.color = activeMenu === item.label ? '#fff' : '#777777';
                                    }}
                                    onClick={() => setActiveMenu(item.label)}
                                >
                                    {item.icon}
                                    <span
                                        style={{
                                            marginLeft: 10,
                                            maxWidth: isSmallScreen || !isCollapsed ? 120 : 0,  // ✅ แสดงเสมอในโหมดมือถือ
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            opacity: isSmallScreen || !isCollapsed ? 1 : 0,  // ✅ ไม่จางหายในมือถือ
                                            transition: 'max-width 0.3s, opacity 0.3s',
                                        }}
                                    >
                                        {item.label}
                                    </span>
                                </li>

                            </Link>
                        ))}
                    </ul>

                    {/* Logout button */}
                    <Box sx={{ marginTop: 'auto', width: '100%' }}> {/* ✅ ทำให้ปุ่มติดด้านล่าง */}
                        <Button
                            sx={{
                                display: 'flex',
                                width: "100%",
                                justifyContent: "left",
                                alignItems: 'center',
                                padding: '10px 16px',
                                borderRadius: '26px',
                                backgroundColor: "#ff7878",
                                color: '#fff',
                                transition: '0.3s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ff4b4b'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ff7878'; }}
                            onClick={handleLogout}
                        >
                            <LogoutRoundedIcon />
                            <p
                                style={{
                                    marginLeft: '10px',
                                    maxWidth: isCollapsed && !isSmallScreen ? 0 : 100, // ถ้าเป็นมือถือ ให้แสดงตลอดเวลาที่เมนูเปิด
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    opacity: isCollapsed && !isSmallScreen ? 0 : 1,   // ถ้าเป็นมือถือ ให้ opacity = 1 เมื่อเปิดเมนู
                                    transition: 'max-width 0.3s, opacity 0.3s',
                                }}
                            >
                                {(!isCollapsed || isSmallScreen) && 'ออกจากระบบ'}
                            </p>

                        </Button>
                    </Box>

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