import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, useMediaQuery } from "@mui/material";
import OrderHistory_filter from './assets/OrderHistory_filter';
import OrderHistory_table from './assets/OrderHistory_table';

const OrderHistory = () => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1040px)");

    const [data, setData] = useState([]);
    const [orderDate, setOrderDate] = useState('');
    const [orderTimeStart, setOrderTimeStart] = useState('');
    const [orderTimeEnd, setOrderTimeEnd] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);

    // Handle changes in date and time inputs
    const handleDateChange = (e) => setOrderDate(e.target.value);
    const handleTimeStartChange = (e) => setOrderTimeStart(e.target.value);
    const handleTimeEndChange = (e) => setOrderTimeEnd(e.target.value);

    // API: Fetch data from server
    useEffect(() => {
        axios.get("http://localhost:5000/api/orders")
            .then((res) => {
                console.log(res.data);
                setData(res.data);
            })
            .catch((err) => console.error("Error fetching orders:", err));
    }, []);

    // Filter orders based on selected date and time
    const filteredOrders = data.filter(order => {
        // แปลงวันที่จาก 27/02/2025 → 2025-02-27
        const formattedOrderDate = order.orderDate.split("/").reverse().join("-");
    
        // เช็ควันที่
        const dateMatch = orderDate ? formattedOrderDate === orderDate : true;
    
        // แปลงเวลาจาก HH:mm:ss → HH:mm
        const formattedOrderTime = order.orderTime.slice(0, 5);
    
        // เช็คเวลาช่วงเริ่มต้น - สิ้นสุด
        const startMatch = orderTimeStart ? formattedOrderTime >= orderTimeStart : true;
        const endMatch = orderTimeEnd ? formattedOrderTime <= orderTimeEnd : true;
    
        return dateMatch && startMatch && endMatch && ['เสร็จสิ้น', 'ยกเลิก'].includes(order.orderStatus);
    });
    

    return (
        <>
            {/* Box ของ MenuList */}
            <Box
                sx={{ backgroundColor: "#fff", width: isMobile ? "100%" : isTablet ? "65%" : "75%", height: "100vh", padding: "20px", borderRadius: "8px", overflowY: "auto", marginRight: "10px" }}
            >
                <OrderHistory_filter
                    orderDate={orderDate}
                    orderTimeStart={orderTimeStart}
                    orderTimeEnd={orderTimeEnd}
                    handleDateChange={handleDateChange}
                    handleTimeStartChange={handleTimeStartChange}
                    handleTimeEndChange={handleTimeEndChange}
                />
                <OrderHistory_table data={filteredOrders} />
            </Box>
        </>
    );
};

export default OrderHistory;
