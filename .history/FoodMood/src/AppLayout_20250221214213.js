import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';

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