import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Drawer, IconButton, useMediaQuery } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import FileCopyRoundedIcon from '@mui/icons-material/FileCopyRounded';
import FindInPageRoundedIcon from '@mui/icons-material/FindInPageRounded';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import FastfoodRoundedIcon from '@mui/icons-material/FastfoodRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';

const Sidebar = ({ unreadNotifications }) => {
    const location = useLocation();
    const isSmallScreen = useMediaQuery('(max-width: 768px)'); // For mobile user
    const [isDrawerOpen, setIsDrawerOpen] = useState(!isSmallScreen); // For computer & tablet user
    const [isCollapsed, setIsCollapsed] = useState(false); // ควบคุมการย่อ/ขยายของ sidebar
    const [activeMenu, setActiveMenu] = useState('');

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
            {/* In case: mobile user | ถ้าเป็นผู้ใช้ที่ใช้งานผ่านอุปกรณ์โทรศัพท์มือถือแถบ Sidebar จะเป็นปุ่มเล็ก ๆ ให้กดเพื่อ expanded */}
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
                    width: isCollapsed ? 80 : 250,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: isCollapsed ? 80 : 250,
                        transition: 'width 0.3s',
                        marginRight: !isSmallScreen ? '10px' : 0, // ✅ ใส่ paddingRight ให้ Drawer จริง ๆ
                    }
                }}
            >
                <Box p={2} sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: isCollapsed ? 'center' : 'flex-start', }}>
                    {/* Sidebar: Collapse button*/}
                    {!isSmallScreen && (
                        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                            {isCollapsed ? <MenuRoundedIcon /> : <MenuOpenRoundedIcon />}
                        </IconButton>
                    )}

                    {/* เมนูรายการ */}
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: 10 }}>
                        {adminMenu.map((item) => (
                            <Link to={item.to} key={item.label} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <li
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        backgroundColor: activeMenu === item.label ? '#e0e0e0' : 'transparent',
                                        cursor: 'pointer',
                                        transition: '0.3s',
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