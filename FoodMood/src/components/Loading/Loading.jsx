// Loading.js
import React from 'react';
import './Loading.css';

const Loading = () => {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>กำลังโหลดข้อมูล...</p>
        </div>
    );
};

export default Loading;
