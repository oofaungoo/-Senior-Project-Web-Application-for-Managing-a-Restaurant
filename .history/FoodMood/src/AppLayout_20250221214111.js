import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';

const AppLayout = () => {
    return (
        <Container>
            <Sidebar />
            <div>
                <Outlet />
            </div>
        </Container>
    );
};

export default AppLayout;