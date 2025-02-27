import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderHistory_filter from './assets/OrderHistory_filter';
import OrderHistory_table from './assets/OrderHistory_table';

const OrderHistory = () => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1040px)");

    const [data, setData] = useState([]);
    const [orderDate, setOrderDate] = useState('');
    const [orderTimeStart, setOrderTimeStart] = useState('');
    const [orderTimeEnd, setOrderTimeEnd] = useState('');

    // Handle changes in date and time inputs
    const handleDateChange = (e) => setOrderDate(e.target.value);
    const handleTimeStartChange = (e) => setOrderTimeStart(e.target.value);
    const handleTimeEndChange = (e) => setOrderTimeEnd(e.target.value);

    // API: Fetch data from server
    useState(() => {
        axios.get("http://localhost:5000/api/orders")
            .then((res) => {
                console.log(res.data);
                setData(res.data);
            })
            .catch((err) => console.error("Error fetching orders:", err));
    }, []);

    const filteredOrders = data.filter(order =>
        ['เสร็จสิ้น', 'ยกเลิก'].includes(order.orderStatus)
    );


    return (
        <>
            {/* Box ของ MenuList */}
            <Box
                sx={{ backgroundColor: "#fff", width: isMobile ? "100%" : isTablet ? "65%" : "75%", height: "100vh", padding: "20px", borderRadius: "8px", overflowY: "auto", marginRight: "10px",}}
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

