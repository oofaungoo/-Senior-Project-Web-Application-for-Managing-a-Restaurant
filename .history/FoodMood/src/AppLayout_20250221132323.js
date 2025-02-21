import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import { Container } from '@mui/material';

const AppLayout = () => {
    return (
        <div className="container">
            <Sidebar />
            <Container>
                <Outlet />
            </Container>
        </div>
    );
};

export default AppLayout;