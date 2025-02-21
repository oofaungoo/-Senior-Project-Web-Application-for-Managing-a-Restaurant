import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import { Container } from '@mui/material';

const AppLayout = () => {
    return (
        <Container sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', padding: 0 }}>
            <Sidebar />
            <div>
                <Outlet />
            </div>
        </Container>
    );
};

export default AppLayout;