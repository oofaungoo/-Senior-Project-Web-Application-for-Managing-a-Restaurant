import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, useMediaQuery, Modal } from "@mui/material";
import OrderHistory_filter from './assets/OrderHistory_filter';
import OrderHistory_table from './assets/OrderHistory_table';
import OrderDetail from './OrderDetail';

const OrderHistory = () => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1040px)");

    const [data, setData] = useState([]);
    const [orderDate, setOrderDate] = useState('');
    const [orderTimeStart, setOrderTimeStart] = useState('');
    const [orderTimeEnd, setOrderTimeEnd] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedData, setSelectedData] = useState(null); // เก็บข้อมูล order ที่ถูกเลือก

    useEffect(() => {
        axios.get("http://localhost:5000/api/orders")
            .then((res) => {
                console.log(res.data);
                setData(res.data);
            })
            .catch((err) => console.error("Error fetching orders:", err));
    }, []);

    useEffect(() => {
        const filtered = data.filter(order => {
            if (!['เสร็จสิ้น', 'ยกเลิก'].includes(order.orderStatus)) return false;
            const [day, month, year] = order.orderDate.split("/");
            const orderDateFormatted = `${year}-${month}-${day}`;
            if (orderDate && orderDateFormatted !== orderDate) return false;
            const orderTimeFormatted = order.orderTime.slice(0, 5);
            if (orderTimeStart && orderTimeFormatted < orderTimeStart) return false;
            if (orderTimeEnd && orderTimeFormatted > orderTimeEnd) return false;
            return true;
        });

        setFilteredOrders(filtered);
    }, [data, orderDate, orderTimeStart, orderTimeEnd]);

    return (
        <>
            <Box
                sx={{ backgroundColor: "#fff", width: isMobile ? "100%" : isTablet ? "65%" : "75%", height: "100vh", padding: "20px", borderRadius: "8px", overflowY: "auto", marginRight: "10px" }}
            >
                <OrderHistory_filter
                    orderDate={orderDate}
                    orderTimeStart={orderTimeStart}
                    orderTimeEnd={orderTimeEnd}
                    handleDateChange={(e) => setOrderDate(e.target.value)}
                    handleTimeStartChange={(e) => setOrderTimeStart(e.target.value)}
                    handleTimeEndChange={(e) => setOrderTimeEnd(e.target.value)}
                />
                <OrderHistory_table data={filteredOrders} onSelectOrder={setSelectedData} />
            </Box>

            {/* แสดง OrderDetail ทางขวาสำหรับ Tablet & Desktop */}
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
                    <OrderDetail
                        selectedOrder={selectedData}
                        onClose={() => setSelectedData(null)}
                    />
                </Box>
            )}

            {/* แสดงเป็น Modal สำหรับ Mobile */}
            {isMobile && (
                <Modal open={!!selectedData} onClose={() => setSelectedData(null)}>
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
                        {selectedData && (
                            <OrderDetail
                                selectedOrder={selectedData}
                                onClose={() => setSelectedData(null)}
                            />
                        )}
                    </Box>
                </Modal>
            )}
        </>
    );
};

export default OrderHistory;
