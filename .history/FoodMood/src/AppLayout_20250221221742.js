import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import { Container } from '@mui/material';
import { Grid } from '@mui/material';

const AppLayout = () => {
    return (
        <Grid >
            <Sidebar />
            <div className="main-content">
                <Outlet />
            </div>
        </Grid>
    );
};

export default AppLayout;

{/* อธิบายโค้ด
    1. maxWigth="none" คือการลบ default maxWigth ของ MUI : ทำให้ Container ไม่มี maxWidth และจะเต็มหน้าจอ
    2. disableGutters : ไม่มี padding ที่ขอบของ Container
*/}