import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { HiKey, HiUser } from "react-icons/hi";
import axios from 'axios';
import cafe_bg from '../../images/cafe_bg.jpg';

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
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={10} sm={8} md={5} lg={4}>
                <Box p={4} boxShadow={3} borderRadius={2} bgcolor="white" textAlign="center">
                    <Typography variant="h5" fontWeight={500} mb={2}>เข้าสู่ระบบ</Typography>
                    
                    <Box display="flex" justifyContent="center" mb={2}>
                        <Button
                            variant={isAdminMode ? "contained" : "outlined"}
                            startIcon={<HiKey />}
                            onClick={() => setIsAdminMode(true)}
                            sx={{ mx: 1 }}
                        >
                            ผู้ดูแลระบบ
                        </Button>
                        <Button
                            variant={!isAdminMode ? "contained" : "outlined"}
                            endIcon={<HiUser />}
                            onClick={() => setIsAdminMode(false)}
                            sx={{ mx: 1 }}
                        >
                            พนักงาน
                        </Button>
                    </Box>
                    
                    <form onSubmit={handleLogin}>
                        {isAdminMode ? (
                            <>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    variant="outlined"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="รหัสผ่าน"
                                    type="password"
                                    variant="outlined"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    margin="normal"
                                    required
                                />
                            </>
                        ) : (
                            <TextField
                                fullWidth
                                label="กรุณากรอก PIN 6 หลัก"
                                type="password"
                                variant="outlined"
                                inputProps={{ maxLength: 6 }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                required
                            />
                        )}
                        {error && <Typography color="error" mt={1}>{error}</Typography>}
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            type="submit"
                        >
                            ล็อกอิน
                        </Button>
                    </form>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Login;
