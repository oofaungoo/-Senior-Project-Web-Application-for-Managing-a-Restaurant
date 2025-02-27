import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, useMediaQuery, Modal } from "@mui/material";
import OrderHistory_filter from './assets/OrderHistory_filter';
import OrderHistory_table from './assets/OrderHistory_table';
import OrderHistory_detail from './assets/OrderHistory_detail';

const OrderHistory = () => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1040px)");

    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
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

    // Function: Filter by Date
    useEffect(() => {
        const filtered = data.filter(order => {
            // เช็คสถานะ ต้องเป็น "เสร็จสิ้น" หรือ "ยกเลิก" เท่านั้น
            if (!['เสร็จสิ้น', 'ยกเลิก'].includes(order.orderStatus)) return false;

            // แปลงวันที่จาก DD/MM/YYYY → YYYY-MM-DD
            const [day, month, year] = order.orderDate.split("/");
            const orderDateFormatted = `${year}-${month}-${day}`; // ให้ตรงกับค่าจาก <input type="date" />

            // ตรวจสอบว่าตรงกับวันที่ที่เลือกหรือไม่
            if (orderDate && orderDateFormatted !== orderDate) return false;

            // แปลงเวลาจาก HH:mm:ss → HH:mm
            const orderTimeFormatted = order.orderTime.slice(0, 5);

            // เช็คช่วงเวลาสั่ง
            if (orderTimeStart && orderTimeFormatted < orderTimeStart) return false;
            if (orderTimeEnd && orderTimeFormatted > orderTimeEnd) return false;

            return true;
        });

        setFilteredOrders(filtered);
    }, [data, orderDate, orderTimeStart, orderTimeEnd]);

    // Function: Select order
    const handleSelectOrder = (order) => {
        setSelectedData(order);
    };


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

            {/* Desktop & Tablet: แสดงรายละเอียดออเดอร์ด้านขวา */}
            {!isMobile && selectedData && (
                <Box
                    sx={{
                        backgroundColor: "#fff",
                        width: isTablet ? "35%" : "25%",
                        height: "100vh",
                        padding: "20px",
                        borderRadius: "8px",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <OrderHistory_detail
                        selectedOrder={selectedData}
                        onClose={() => setSelectedData(null)}
                    />
                </Box>
            )}

            {/* Mobile - ใช้ Modal */}
            {isMobile && selectedData && (
                <Modal
                    open={Boolean(selectedData)}
                    onClose={() => setSelectedData(null)}
                >
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            padding: "15px",
                            borderRadius: "8px",
                            maxWidth: "90vw",
                            height: "80vh",
                            margin: "10vh auto",
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <OrderHistory_detail
                            selectedOrder={selectedData}
                            onClose={() => setSelectedData(null)}
                        />
                    </Box>
                </Modal>
            )}
        </>
    );
};

export default OrderHistory;
