import React from "react";

const OrderList = ({ filteredOrders, selectOrder }) => {
    const statusColors = {
        "ยังไม่เริ่ม": "#FF9800", // Orange
        "กำลังทำ": "#2196F3", // Blue
        "พร้อมเสิร์ฟ": "#4CAF50", // Green
        "เสร็จสิ้น": "#9E9E9E", // Grey
        "ยกเลิก": "#F44336", // Red
    };

    return (
        <Grid container spacing={1}>
            {filteredOrders.length > 0 ? (
                filteredOrders.map((data) => (
                    <Grid item xs={6} md={4} lg={2} key={data.orderNumber}>
                        <Paper
                            sx={{
                                minHeight: 200,
                                padding: 2,
                                borderTop: `5px solid ${statusColors[data.orderStatus] || "#000"
                                    }`,
                            }}
                        >
                            <p className="right-box-header fs-20 fw-5 text-center">
                                ออเดอร์ที่ {data.orderNumber}
                            </p>

                            <p>สถานะ: {data.orderStatus}</p>
                            <p>เวลาที่สั่ง: {data.orderTime}</p>
                        </Paper>
                    </Grid>
                ))
            ) : (
                <p>ไม่พบออเดอร์</p>
            )}
        </Grid>
    );
};

export default OrderList;
