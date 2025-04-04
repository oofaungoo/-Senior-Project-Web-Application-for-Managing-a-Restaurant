import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Paper } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import Swal from "sweetalert2";
import ListAltIcon from '@mui/icons-material/ListAlt';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import CancelIcon from '@mui/icons-material/Cancel';
import PaidIcon from '@mui/icons-material/Paid';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const Dashboard = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [foods, setFoods] = useState([]);
    const [foodCategories, setFoodCategories] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                title: "Sesstion ของคุณหมดอายุ",
                text: "กรุณาเข้าสู่ระบบใหม่",
                icon: "warning",
                confirmButtonColor: "#64A2FF",
                confirmButtonText: "OK"
            }).then(() => navigate('/'));
            return;
        }

        axios.get('http://localhost:5000/api/orders')
            .then(res => setOrders(res.data))
            .catch(err => console.error('Error fetching orders:', err));

        axios.get('http://localhost:5000/api/foods')
            .then(res => setFoods(res.data))
            .catch(err => console.error('Error fetching foods:', err));
        axios.get('http://localhost:5000/api/add_menus/category')
            .then(res => setFoodCategories(res.data))
            .catch(err => console.error('Error fetching categories:', err));
        axios.get('http://localhost:5000/api/ingredients')
            .then(res => setIngredients(res.data))
            .catch(err => console.error('Error fetching categories:', err));
    }, []);

    const filteredOrders = orders.filter(order => {
        if (!order.orderDate) return false;

        // แปลง "04/03/2025" -> "2025-03-04"
        const [day, month, year] = order.orderDate.split('/');
        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate === selectedDate;
    });

    const data = [
        { label: "ออเดอร์ทั้งหมด", value: filteredOrders.length, bgColor: "#D9E7FF", icon: <ListAltIcon sx={{ backgroundColor: "#5294F9", fontSize: 50, color: "#D9E7FF", borderRadius: "50%", padding: "8px" }} /> },
        { label: "ออเดอร์ที่ยกเลิก", value: filteredOrders.filter(order => order.orderStatus === "ยกเลิก").length, bgColor: "#FFD4E3", icon: <CancelIcon sx={{ fontSize: 50, color: "#DC3370", }} /> },
        {
            label: "เมนูทั้งหมดที่สั่ง",
            value: filteredOrders
                .filter(order => order.orderStatus !== "ยกเลิก") // ตัดออเดอร์ที่ถูกยกเลิกออก
                .reduce((total, order) =>
                    total + order.orderItems.reduce((sum, item) => sum + item.quantity, 0), 0),
            bgColor: "#FFF0C0",
            icon: <FastfoodIcon sx={{ color: "#F3BD17", fontSize: 50 }} />
        },
        {
            label: "รายได้สุทธิประจำวันวัน",
            value: `${filteredOrders
                .filter(order => order.orderStatus !== "ยกเลิก") // ตัดออเดอร์ที่ถูกยกเลิกออก
                .reduce((total, order) => total + order.totalPrice, 0)
                .toLocaleString()} ฿`,
            bgColor: "#E0F0CA",
            icon: <PaidIcon sx={{ color: "#85BD39", fontSize: 50 }} />
        },
        {
            label: "ยอดเงินสด",
            value: `${filteredOrders
                .filter(order => order.orderStatus !== "ยกเลิก" && order.paidType === "เงินสด") // กรองเฉพาะออเดอร์ที่จ่ายเป็นเงินสด
                .reduce((total, order) => total + order.totalPrice, 0)
                .toLocaleString()} ฿`,
            bgColor: "#ebd9ff",
            icon: <PaymentsIcon sx={{ color: "#ac73ee", fontSize: 50 }} />
        },
        {
            label: "ยอดเงินโอน Mobile Banking",
            value: `${filteredOrders
                .filter(order => order.orderStatus !== "ยกเลิก" && order.paidType === "โอนผ่านธนาคาร") // กรองเฉพาะออเดอร์ที่จ่ายผ่านธนาคาร
                .reduce((total, order) => total + order.totalPrice, 0)
                .toLocaleString()} ฿`,
            bgColor: "#ffe4c5",
            icon: <AccountBalanceIcon sx={{ color: "#fca644", fontSize: 50 }} />
        },        
    ];

    const getTopMenus = (filteredOrders, foods, categoryFilter) => {
        const menuOrderCount = {};
    
        // กรองออเดอร์ที่ไม่ใช่ "ยกเลิก" ออกก่อน
        const validOrders = filteredOrders.filter(order => order.orderStatus !== "ยกเลิก");

        validOrders.forEach(order => {
            order.orderItems.forEach(item => {
                if (!menuOrderCount[item.name]) {
                    menuOrderCount[item.name] = 0;
                }
                menuOrderCount[item.name] += item.quantity;
            });
        });
    
        let filteredMenus = foods.map(food => ({
            ...food,
            totalQuantityOrdered: menuOrderCount[food.name] || 0
        }));
    
        if (categoryFilter) {
            filteredMenus = filteredMenus.filter(food => food.category === categoryFilter);
        }
    
        return filteredMenus.sort((a, b) => b.totalQuantityOrdered - a.totalQuantityOrdered).slice(0, 6);
    };
    
    // ใช้งาน getTopMenus
    const topMenus = getTopMenus(filteredOrders, foods, categoryFilter);

    // Data & Function: สำหรับกราฟพาย แสดง Order by Status
    const statusColors = {
        "ยังไม่เริ่มทำ": "#9E9E9E",
        "กำลังทำ": "#f7b047",
        "พร้อมเสิร์ฟ": "#4CAF50",
        "เสร็จสิ้น": "#64A2FF",
        "ยกเลิก": "#ff7878",
    };
    const orderStatusData = Object.entries(
        filteredOrders.reduce((acc, order) => {
            acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
            return acc;
        }, {})
    ).map(([orderStatus, count]) => ({
        name: orderStatus,
        value: count,
        color: statusColors[orderStatus] || "#ccc",
    }));

    // Data & Function: สำหรับกราฟพาย แสดง ประเภทอาหาร
    const categoryColors = {
        "ของทานเล่น": "#f7b047",
        "อาหารตามสั่ง": "#ff7878",
        "อาหารอีสาน": "#ac73ee",
        "ยำ": "#4CAF50",
        "เครื่องดื่ม": "#64A2FF",
        "ของหวาน": "#ff9ce6",
        "เมนูทะเล": "#007bff",
        "อื่น ๆ": "#D4A373",
    };
    const categoryData = Object.entries(
        filteredOrders
            .filter(order => order.orderStatus !== "ยกเลิก") // ตัดออเดอร์ที่ถูกยกเลิกออก
            .flatMap(order => order.orderItems)
            .reduce((acc, item) => {
                acc[item.category] = (acc[item.category] || 0) + item.quantity;
                return acc;
            }, {})
    ).map(([name, value]) => ({
        name,
        value,
        color: categoryColors[name] || "#8884d8",
    }));

    // หาวัตถุดิบ 5 รายการที่มี remain ต่ำสุด
    const lowStockIngredients = [...ingredients]
        .sort((a, b) => a.remain - b.remain)
        .slice(0, 5);

    return (
        <Box sx={{ backgroundColor: "#fff", width: "100%", height: "100vh", padding: "20px", borderRadius: "8px", overflowY: "auto", marginRight: "10px" }}>
            {/* Date Picker */}
            <div style={{ borderBottom: "2px solid #ddd", marginBottom: "8px", paddingBottom: "8px", justifyContent: "center", display: "flex" }}>
                <input type="date" id="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>

            {/* ข้อมูลสรุป */}
            <Grid container spacing={2} mb="8px">
                {data.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper sx={{ width: "100%", height: "80px", padding: "14px", display: "flex", alignItems: "center", backgroundColor: item.bgColor }}>
                            <Grid container sx={{ flexGrow: 1, alignItems: "center", justifyContent: "space-between" }}>
                                <Grid item>
                                    <p style={{ color: "#4d4d4d", lineHeight: 1.5 }}>{item.label}</p>
                                    <p style={{ color: "#4d4d4d", fontWeight: 600, fontSize: 22 }}>{item.value}</p>
                                </Grid>
                                <Grid item>
                                    {item.icon}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Graph section */}
            <Grid container spacing={2} mb="8px" style={{ borderBottom: "2px solid #ddd", marginBottom: "8px", paddingBottom: "8px"}}>
                <Grid item xs={12} md={6} lg={3}>
                    <Paper sx={{ padding: "14px" }}>
                        <p style={{ fontSize: 20, fontWeight: 500, marginBottom: "8px" }}>Order by Status</p>
                        <PieChart width={300} height={383}>
                            <Pie
                                data={orderStatusData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {orderStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <Paper sx={{ padding: "14px" }}>
                        <p style={{ fontSize: 20, fontWeight: 500, marginBottom: "8px" }}>ประเภทอาหารที่สั่งจากออเดอร์ทั้งหมด</p>
                        <PieChart width={300} height={383}>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </Paper>
                </Grid>
                {/* ปุ่ม Filter หมวดหมู่อาหาร */}
                <Grid item xs={12} md={12} lg={6}>
                    <Paper sx={{ padding: "14px" }}>
                    <p style={{ fontSize: 20, fontWeight: 500, marginBottom: "8px" }}>เมนูขายดีประจำวัน ⭐</p>
                    <Grid style={{ marginBottom: "8px" }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {foodCategories.map(cat => (
                                <div
                                    key={cat._id}
                                    onClick={() => setCategoryFilter(categoryFilter === cat.name ? '' : cat.name)}
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: "20px",
                                        backgroundColor: categoryFilter === cat.name ? "#64A2FF" : "#ddd",
                                        cursor: "pointer"
                                    }}>
                                    {cat.name}
                                </div>
                            ))}
                        </div>
                    </Grid>

                    {/* เมนูยอดนิยม */}
                    <Grid container spacing={1}>
                        {topMenus.map(item => (
                            <Grid item xs={4} md={2} lg={4} key={item._id}>
                                <Paper elevation={2} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                                    <img
                                        style={{ borderRadius: 5, marginBottom: 10, width: "100%", height: "6rem", objectFit: "cover" }}
                                        src={item.image || "https://via.placeholder.com/150"}
                                        alt={item.name}
                                    />
                                    <div style={{ padding: "0 10px 10px" }}>
                                        <p style={{ fontSize: 18, fontWeight: 400, color: '#000', textAlign: "left" }}>{item.name}</p>
                                        <p style={{ fontSize: 15, fontWeight: 400, color: '#777', textAlign: "left" }}>ปริมาณที่สั่ง: {item.totalQuantityOrdered}</p>
                                    </div>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                        </Paper>
                    
                </Grid>

            </Grid>

            <Grid item width="100%">
                <Paper sx={{ padding: "14px" }}>
                    <Grid container spacing={2}>
                        {/* กราฟด้านซ้าย */}
                        <Grid item xs={12} md={7}>
                            <p style={{ fontSize: 20, fontWeight: 500, marginBottom: "8px" }}>จำนวนวัตถุดิบคงเหลือต่อวัตถุดิบขั้นต่ำ</p>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={lowStockIngredients}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="remain" fill="#ff6f61" name="คงเหลือ" />
                                    <Bar dataKey="min" fill="#8884d8" name="ขั้นต่ำ" />
                                    <Legend />
                                </BarChart>
                            </ResponsiveContainer>
                        </Grid>

                        {/* ตารางด้านขวา */}
                        <Grid item xs={12} md={5}>
                            <p style={{ fontSize: 20, fontWeight: 500, marginBottom: "8px" }}>วัตถุดิบที่ปริมาณ<span style={{color:"#ff7878"}}>คงเหลือ</span>น้อยกว่า<span style={{color:"#ff7878"}}>ขั้นต่ำ</span></p>
                            <Paper sx={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    rows={ingredients.filter(item => item.remain < item.min)} // กรองเฉพาะที่ remain น้อยกว่า min
                                    getRowId={(row) => row._id} // ใช้ _id เป็น id
                                    columns={[
                                        { field: 'name', headerName: 'ชื่อวัตถุดิบ', flex: 1 },
                                        { field: 'group', headerName: 'หมวดหมู่', flex: 1 },
                                        { field: 'remain', headerName: 'คงเหลือ', type: 'number', flex: 1, align: 'right', headerAlign: 'right',
                                            renderCell: (params) => (
                                                <span style={{ color: params.row.min > params.row.remain ? '#ff7878' : 'inherit' }}>
                                                    {params.value}
                                                </span>
                                            ) },
                                         ,
                                        { field: 'min', headerName: 'ขั้นต่ำ', type: 'number', flex: 1, align: 'right', headerAlign: 'right' },
                                        { field: 'unit', headerName: 'หน่วย', flex: 1, align: 'right', headerAlign: 'right' },
                                    ]}
                                    sx={{fontFamily:"inherit"}}
                                    pageSize={10}
                                    rowsPerPageOptions={[5, 10, 20]}
                                    disableSelectionOnClick
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Box>
    );
};

export default Dashboard;
