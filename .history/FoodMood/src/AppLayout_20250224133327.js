import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import { Container } from '@mui/material';

const AppLayout = () => {
    return (
        <Container maxWidth="none" spacing={0} disableGutters sx={{ display: 'flex', width: '100vw', height: '100vh', padding: 0 }}>
            <Sidebar />
            <div className="main-content">
                <div className='container'>
                    <Outlet />
                </div>
                
            </div>
        </Container>
    );
};

export default AppLayout;

{/* อธิบายโค้ด
    1. maxWigth="none" คือการลบ default maxWigth ของ MUI : ทำให้ Container ไม่มี maxWidth และจะเต็มหน้าจอ
    2. disableGutters : ไม่มี padding ที่ขอบของ Container
*/}