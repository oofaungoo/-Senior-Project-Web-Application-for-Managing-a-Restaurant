import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';

const AppLayout = () => {
    return (
        <Container sx={{ display: 'flex' }}>
            <Sidebar />
            <div className="main-content">
                <Outlet />
            </div>
        </Container>
    );
};

export default AppLayout;