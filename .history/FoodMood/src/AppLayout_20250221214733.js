import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import { Container } from '@mui/material';

const AppLayout = () => {
    return (
        <Container 
            maxWidth="none" 
            disableGutters 
            sx={{ display: 'flex', width: '100vw', height: '100vh', padding: 0 }}
        >
            <Sidebar />
            <div className="main-content">
                <Outlet />
            </div>
        </Container>
    );
};

export default AppLayout;