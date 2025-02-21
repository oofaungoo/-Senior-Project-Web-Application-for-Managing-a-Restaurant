import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';

const AppLayout = () => {
    return (
        <div className="container">
            <Sidebar />
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export default AppLayout;