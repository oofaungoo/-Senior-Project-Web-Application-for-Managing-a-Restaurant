import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Container from '@mui/material/Container';

const AppLayout = () => {
    return (
        <div className="container" style={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <Container
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    backgroundColor: '#f4f4f4',
                    padding: 2,
                }}
            >
                <Outlet />
            </Container>
        </div>
    );
};

export default AppLayout;