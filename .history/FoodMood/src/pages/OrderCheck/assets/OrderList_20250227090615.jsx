import React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Paper } from "@mui/material";

const OrderList = ({ orders, selectOrder }) => {
    const statusColors = {
        "ยังไม่เริ่ม": "#9E9E9E", // Orange
        "กำลังทำ": "##FF9800", // Blue
        "พร้อมเสิร์ฟ": "#2196F3", // Green
        "เสร็จสิ้น": "#4CAF50", // Grey
        "ยกเลิก": "#F44336", // Red
    };

    return (
        <Grid container spacing={1}>
            {orders?.length > 0 ? (
                orders.map((data) => (
                    <Grid item xs={4} md={2} lg={2} key={data.orderNumber}>
                        <Button style={{ height: "100%", padding: 0, margin: 0, display: "flex" }}>
                            <Paper sx={{ minHeight: 200, padding: 2, borderTop: `5px solid ${statusColors[data.orderStatus] || "#000"}`, }} onClick={() => selectOrder(data)}>
                                <p className="right-box-header fs-20 fw-5 text-center">ออเดอร์ที่ {data.orderNumber}</p>
                                <p>สถานะ: {data.orderStatus}</p>
                                <p>เวลาที่สั่ง: {data.orderTime}</p>
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
