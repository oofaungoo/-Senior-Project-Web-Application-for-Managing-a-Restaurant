import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box, Paper, Button } from "@mui/material";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import Swal from "sweetalert2";
import Food from '../../images/food.jpg'

const Dashboard = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [foods, setFoods] = useState([]);

    const [filteredFoods, setFilteredFoods] = useState([]);
    const [foodCategories, setFoodCategories] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({ title: "Sesstion ของคุณหมดอายุ", text: "กรุณาเข้าสู่ระบบใหม่", icon: "warning", confirmButtonColor: "#64A2FF", confirmButtonText: "OK" })
                .then(() => { navigate('/'); });
            return;
        }
        axios.get('http://localhost:5000/api/orders')
            .then(res => setOrders(res.data))
            .catch(err => console.error('Error fetching orders:', err));
        axios.get('http://localhost:5000/api/foods')
            .then(res => setFoods(res.data))
            .catch(err => console.error('Error fetching :', err));
        axios.get('http://localhost:5000/api/add_menus/category')
            .then(res =>  setFoodCategories(res.data))
            .catch(err => console.error('Error fetching categories:', err));
    }, []);

    return (
        <Box sx={{ backgroundColor: "#fff", width: "100%", height: "100vh", padding: "20px", borderRadius: "8px", overflowY: "auto", marginRight: "10px", }}>
            {/* ช่องสำหรับเลือกวันที่ */}


            {/* ข้อมูลทั่วไป เช่น ออเดอร์ที่สั่งวันนี้ ออเดอร์ที่สำเร็จ(orderStatus="เสร็จสิ้น") ออเดอร์ที่โดนยกเลิก(orderStatus="ยกเลิก") */}


            {/* รายการเมนูขายดีประจำวัน (โชว์แค่ 6 เมนู แต่สามารถฟิลเตอร์) */}
            <Grid container spacing={1}>
                {foods.map((item) => (
                    <Grid item xs={6} md={4} lg={2} key={item._id} height={200}>
                        <Paper elevation={2} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <Button style={{ height: "100%", padding: 0, margin: 0, display: "flex", flexDirection: "column" }}>
                                <Grid container direction="column" style={{ height: "100%" }}>
                                    <img
                                        style={{ borderRadius: 5, marginBottom: 10, width: "100%", height: "6rem", objectFit: "cover", }}
                                        src={item.image || Food}
                                        alt={item.name}
                                    />
                                    <p style={{ fontSize: 18, fontWeight: 4, color: '#000000', textAlign: "left", padding: "0 10px 0" }}>{item.name}</p>
                                    <p style={{ fontSize: 15, fontWeight: 4, color: '#777777', textAlign: "left", padding: "0 10px 0" }}>ปริมาณที่สั่ง: </p>
                                    <p style={{ fontSize: 15, fontWeight: 4, color: '#777777', textAlign: "left", padding: "0 10px 10px" }}>จำนวนออเดอร์ที่สั่ง: </p>
                                </Grid>
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

        </Box>
    );
};

export default Dashboard;
