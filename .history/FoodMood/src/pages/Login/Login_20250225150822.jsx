import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button, Typography, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';
import cafe_bg from '../../images/cafe_bg.jpg';
import logo from '../../images/logo.png';

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
        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh', backgroundImage: `url(${cafe_bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <Grid item xs={10} sm={8} md={5} lg={4}>
                <Box p={4} boxShadow={3} borderRadius={2} bgcolor="#fff" textAlign="center">
                    {/*<p style={{ fontSize: 24, fontWeight: 500, justifyContent: "center", marginBottom: 20, paddingBottom:8, borderBottom: "1px solid #ddd" }}>เข้าสู่ระบบ</p>
                        */}
                    <img src={logo} style={{width:"200", }}/>
                    <Box display="flex" justifyContent="center" mb={2}>
                        <Button variant={isAdminMode ? "contained" : "outlined"} startIcon={<KeyIcon />} onClick={() => setIsAdminMode(true)}
                            sx={{ mx: 1, fontSize: 18, fontFamily: "inherit", borderRadius:8, backgroundColor: isAdminMode ? '#64A2FF' : 'transparent', color: isAdminMode ? '#fff' : '#64A2FF', borderColor: '#64A2FF', '&:hover': { backgroundColor: '#4F91E3', color: "#fff" } }}
                        >
                            แอดมิน/เจ้าของร้าน
                        </Button>
                        <Button variant={!isAdminMode ? "contained" : "outlined"} endIcon={<PersonIcon />} onClick={() => setIsAdminMode(false)}
                            sx={{ mx: 1, fontSize: 18, fontFamily: "inherit", borderRadius:8, backgroundColor: !isAdminMode ? '#64A2FF' : 'transparent', color: !isAdminMode ? '#fff' : '#64A2FF', borderColor: '#64A2FF', '&:hover': { backgroundColor: '#4F91E3', color: "#fff" } }}
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
                                    label="Password"
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
                                inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.3rem' } }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                required
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">🔢</InputAdornment>
                                }}
                            />
                        )}
                        {error && <Typography color="error" mt={1}>{error}</Typography>}
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2, fontSize: 18, fontFamily: "inherit", borderRadius:8, backgroundColor: '#62c965', '&:hover': { backgroundColor: '#4F91E3' } }}
                            type="submit"
                        >
                            
                        </Button>
                    </form>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Login;
