import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, Typography, Chip, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";


const Noti = () => {
    const navigate = useNavigate();

    const [foods, setFoods] = useState([]);

    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState();
    const [lowStockItems, setLowStockItems] = useState();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({ title: "Sesstion ของคุณหมดอายุ", text: "กรุณาเข้าสู่ระบบใหม่", icon: "warning", confirmButtonColor: "#64A2FF", confirmButtonText: "OK" })
                .then(() => { navigate('/'); });
            return;
        }
        axios.get('http://localhost:5000/api/foods')
            .then(res => setFoods(res.data))
            .catch(err => console.error('Error fetching foods:', err));
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
                <p style={{ fontSize: 24 }}>🔔 การแจ้งเตือน</p>
            </Stack>

            {notifications.length > 0 ? (
                <Stack spacing={2}>
                    {notifications.map((noti) => (
                        <Card key={noti.id} sx={{ borderLeft: "5px solid red", boxShadow: 3 }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <p style={{ fontWeight: 600, fontSize: 24, lineHeight: 2 }}>{noti.item}</p>
                                    {noti.isNew && <Chip label="New" color="error" size="small" />}
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    <p style={{ fontSize: 20, lineHeight: 2 }}>
                                        วัตถุดิบ <strong>&nbsp;{noti.item}&nbsp;</strong> เหลือเพียง
                                        <strong style={{ color: "red" }}> &nbsp;{noti.remain} {noti.unit}&nbsp;</strong>
                                        จากจำนวนขั้นต่ำ <strong style={{ color: "red" }}>&nbsp;{noti.min} {noti.unit}&nbsp;</strong>
                                    </p>
                                </Typography>   
                                <Typography variant="caption" color="text.secondary">
                                    <p style={{ fontSize: 18, lineHeight: 2 }}>📅 {noti.time}</p>
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
