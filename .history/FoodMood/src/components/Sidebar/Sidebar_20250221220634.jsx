import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Grid, IconButton, Badge } from '@mui/material';
import { MdFastfood } from "react-icons/md";
import { HiDocumentAdd, HiDocumentDuplicate, HiDocumentSearch, HiUserGroup, HiLogout, HiInbox, HiChevronLeft, HiChevronRight, HiBell, HiMenu } from 'react-icons/hi';

const Sidebar = () => {
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState('');
    const [isExpanded, setIsExpanded] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(3); // Mock data

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
            icon: (
                <Badge badgeContent={unreadNotifications} color="error">
                    <HiBell />
                </Badge>
            ),
        }
    ];

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        if (menu === 'การแจ้งเตือน') {
            setUnreadNotifications(0);
        }
    };

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        const currentPath = location.pathname;
        const activeItem = adminMenu.find(item => item.to === currentPath);
        if (activeItem) {
            setActiveMenu(activeItem.label);
        }
    }, [location.pathname, adminMenu]);

    const drawerContent = (
        <List>
            {adminMenu.map((item) => (
                <Link to={item.to} key={item.label} style={{ textDecoration: 'none' }}>
                    <ListItem 
                        button 
                        selected={activeMenu === item.label} 
                        onClick={() => handleMenuClick(item.label)}
                        sx={{
                            backgroundColor: activeMenu === item.label ? 'var(--dark-blue-color)' : 'var(--blue-color)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'var(--dark-blue-color)',
                            },
                            borderRadius: '8px',
                            margin: '5px 10px',
                        }}
                    >
                        <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                        {isExpanded && <ListItemText primary={item.label} />}
                    </ListItem>
                </Link>
            ))}
            <ListItem 
                button
                sx={{
                    backgroundColor: 'var(--blue-color)',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'var(--dark-blue-color)',
                    },
                    borderRadius: '8px',
                    margin: '5px 10px',
                }}
            >
                <ListItemIcon sx={{ color: 'white' }}><HiLogout /></ListItemIcon>
                {isExpanded && <ListItemText primary="ออกจากระบบ" />}
            </ListItem>
        </List>
    );

    return (
        <Grid container>
            {/* Sidebar for large screens */}
            <Grid item xs={12} md={3} lg={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Drawer
                    variant="permanent"
                    open={isExpanded}
                    sx={{
                        width: isExpanded ? 240 : 60,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': { width: isExpanded ? 240 : 60, boxSizing: 'border-box' },
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
                        {isExpanded && <span>FoodMood.</span>}
                        <IconButton onClick={toggleSidebar}>
                            {isExpanded ? <HiChevronLeft /> : <HiChevronRight />}
                        </IconButton>
                    </div>
                    {drawerContent}
                </Drawer>
            </Grid>

            {/* Sidebar for mobile screens */}
            <IconButton
                sx={{ display: { xs: 'block', md: 'none' }, position: 'absolute', top: 10, left: 10 }}
                onClick={handleDrawerToggle}
            >
                <HiMenu />
            </IconButton>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    '& .MuiDrawer-paper': { width: 240 },
                }}
            >
                {drawerContent}
            </Drawer>
        </Grid>
    );
}

export default Sidebar;
