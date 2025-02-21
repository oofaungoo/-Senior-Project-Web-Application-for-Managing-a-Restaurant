import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';

const AppLayout = () => {
    return (
        <div className="container">
            <Sidebar />
            <dic className="main-content">
                <Outlet />
            </ก>
        </div>
    );
};

export default AppLayout;