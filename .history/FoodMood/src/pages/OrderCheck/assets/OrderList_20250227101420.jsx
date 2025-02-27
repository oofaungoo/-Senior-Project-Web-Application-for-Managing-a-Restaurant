import React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Paper } from "@mui/material";

const OrderList = ({ orders, selectOrder }) => {
    const statusColors = {
        "ยังไม่เริ่ม": "#9E9E9E", // Orange
        "กำลังทำ": "#f7b047", // Blue
        "พร้อมเสิร์ฟ": "#2196F3", // Green
        "เสร็จสิ้น": "#4CAF50", // Grey
        "ยกเลิก": "#F44336", // Red
    };

    return (
        <Grid container spacing={1}>
            {orders?.length > 0 ? (
                orders.map((data) => (
                    <Grid item xs={5} md={4} lg={2} key={data.orderNumber}>
                        <Button style={{ height: "100%", padding: 0, margin: 0, display: "flex" }}>
                            <Paper sx={{ width: "100%", height: 200, padding: 2, borderTop: `5px solid ${statusColors[data.orderStatus] || "#000"}`, }} onClick={() => selectOrder(data)}>
                                <p className="right-box-header fs-20 fw-5 text-center">Order: {data.orderNumber}</p>
                                <p>สถานะ: {data.orderStatus}</p>
                                <p>วันที่: {data.orderDate}</p>
                                <p>เวลา: {data.orderTime}</p>
                            </Paper></Button>
                    </Grid>
                ))
            ) : (
                <p>ไม่พบออเดอร์</p>
            )}
        </Grid>
    );
};

export default OrderList;
