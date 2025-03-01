import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Chip, Stack, Button } from '@mui/material';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';

const Noti = ({ setUnreadNotifications = () => { }, setLowStockItems = () => { } }) => {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({ title: "Sesstion ของคุณหมดอายุ", text: "กรุณาเข้าสู่ระบบใหม่", icon: "warning", confirmButtonColor: "#64A2FF", confirmButtonText: "OK" })
                .then(() => { navigate('/'); });
            return;
        }
        axios.get('http://localhost:5000/api/ingredients')
            .then(res => {
                const ingredients = res.data;

                const lowStock = ingredients.filter(item => item.remain < item.min);

                setLowStockItems(lowStock);
                setUnreadNotifications(lowStock.length);

                const notiData = lowStock.map(item => ({
                    id: item._id,
                    item: item.name,
                    remain: item.remain,
                    min: item.min,
                    unit: item.unit,
                    time: new Date().toLocaleString(),
                    isNew: true,
                }));

                setNotifications(notiData);
            })
            .catch(err => console.error('Error fetching ingredients:', err));
    }, [setUnreadNotifications, setLowStockItems]);

    const clearNotifications = () => {
        setNotifications([]);
        setUnreadNotifications(0);
    };

    return (
        <Box
            sx={{
                backgroundColor: "#fff",
                width: "100%",
                height: "100vh",
                padding: "20px",
                borderRadius: "8px",
                overflowY: "auto",
                marginRight: "10px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">🔔 การแจ้งเตือน</Typography>
                {notifications.length > 0 && (
                    <Button variant="contained" color="error" onClick={clearNotifications}>
                        ล้างแจ้งเตือน
                    </Button>
                )}
            </Stack>

            {notifications.length > 0 ? (
                <Stack spacing={2}>
                    {notifications.map((noti) => (
                        <Card key={noti.id} sx={{ borderLeft: "5px solid red", boxShadow: 3 }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle1" fontWeight="bold">{noti.item}</Typography>
                                    {noti.isNew && <Chip label="New" color="error" size="small" />}
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    วัตถุดิบ <strong>{noti.item}</strong> เหลือเพียง
                                    <strong style={{ color: "red" }}> {noti.remain} {noti.unit}</strong>
                                    จากจำนวนขั้นต่ำ <strong style={{ color: "red" }}>{noti.min} {noti.unit}</strong>
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    📅 {noti.time}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <Typography variant="body1" color="text.secondary" align="center">
                    ไม่มีการแจ้งเตือน
                </Typography>
            )}
        </Box>
    );
};

export default Noti;
