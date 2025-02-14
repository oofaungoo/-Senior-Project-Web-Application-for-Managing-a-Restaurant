import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container">
            <Sidebar /> {/* Sidebar stays consistent */}
            <div className="main-content">
                <Outlet /> {/* This is where MenuManager or other components load */}
            </div>
        </div>
    );
}

export default Home;
