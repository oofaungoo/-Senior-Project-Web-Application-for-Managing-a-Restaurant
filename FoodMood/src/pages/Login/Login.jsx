import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { HiKey, HiUser } from "react-icons/hi";
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAdminMode, setIsAdminMode] = useState(true); // Toggle between admin and normal user modes
    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // เตรียมข้อมูลสำหรับส่งไปยัง API
            const body = {
                username: isAdminMode ? username : 'employee',
                password
            };
    
            const res = await axios.post('http://localhost:5000/api/users/login', body);
    
            console.log('Response Data:', res.data);

            if (res.data.role_id === '1') {
                navigate('/UserManager');
            } 
            if (res.data.role_id === '2') {
                navigate('/OrderCreate');
            }
    
        } catch (error) {
            console.error('Login Error:', error);
    
            if (error.response) {
                const { status, data } = error.response;
                if (status === 401) {
                    setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
                } else {
                    setError(data.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
                }
            } else {
                setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
            }
        }
    };
    

    return (
        <div className="login-container">
            <div className='fs-20 fw-5' style={{marginBottom: '10px'}}>เข้าสู่ระบบ</div>
            <div className="toggle-mode">
                <div
                    className={`filter-bubble ${isAdminMode ? 'active' : ''}`}
                    onClick={() => setIsAdminMode(true)}
                >
                    <HiKey /> ผู้ดูแลระบบ
                </div>
                <div
                    className={`filter-bubble ${!isAdminMode ? 'active' : ''}`}
                    onClick={() => setIsAdminMode(false)}
                >
                    พนักงาน <HiUser />
                </div>
            </div>
            <form onSubmit={handleLogin} className="login-form" >
                {isAdminMode ? (
                    <>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="รหัสผ่าน"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </>
                ) : (
                    <input
                        type="password"
                        placeholder="กรุณากรอก PIN 6 หลัก"
                        maxLength="6"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                )}
                {error && <div className="error-message">{error}</div>}
                
            </form>
            <div className='blue-button' style={{marginTop: '20px'}}onClick={handleLogin}>ล็อกอิน</div>
        </div>
    );
};

export default Login;
