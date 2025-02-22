import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import { Container } from '@mui/material';
import { Grid } from '@mui/material';

const AppLayout = () => {
    return (
        <Grid container sx={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
            <Grid item>
                <Sidebar />
            </Grid>
            <Grid item>
                <Outlet />
            </Grid>
        </Grid>
    );
};

export default AppLayout;

{/* อธิบายโค้ด
    1. maxWigth="none" คือการลบ default maxWigth ของ MUI : ทำให้ Container ไม่มี maxWidth และจะเต็มหน้าจอ
    2. disableGutters : ไม่มี padding ที่ขอบของ Container
*/}