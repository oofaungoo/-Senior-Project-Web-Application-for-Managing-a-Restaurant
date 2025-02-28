import React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Paper } from "@mui/material";

const OrderList = ({ orders, selectOrder }) => {
    const statusColors = {
        "ยังไม่เริ่ม": "#9E9E9E",
        "กำลังทำ": "#f7b047",
        "พร้อมเสิร์ฟ": "#4CAF50",
    };

    return (
        <Grid container spacing={1}>
            {orders?.length > 0 ? (
                orders.map((data) => (
                    <Grid item xs={5} md={4} lg={2} key={data.orderNumber}>
                        <Button style={{ height: "100%", padding: 0, margin: 0, display: "flex" }}>
                            <Paper
                                sx={{
                                    width: "500",
                                    height: 200,
                                    padding: 1.5,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    borderTop: `5px solid ${statusColors[data.orderStatus] || "#000"}`,
                                }}
                                onClick={() => selectOrder(data)}
                            >
                                {/* หมายเลขออเดอร์ตรงกลาง */}
                                <p
                                    style={{
                                        fontSize: 24,
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        borderBottom: "1px solid #ddd",
                                        marginBottom: "8px",
                                    }}
                                >
                                    #{data.orderNumber}
                                </p>

                                {/* โต๊ะ/เบอร์โทร + วันที่ + เวลา */}
                                <div style={{ textAlign: "center", flex: 1 }}>
                                    <p>โต๊ะ: {data.contactInfo.tableNumber || "ไม่ระบุ"}</p>
                                    <p>เบอร์โทร: {data.contactInfo.phoneNumber || "ไม่ระบุ"}</p>
                                    <p>วันที่: {data.orderDate}</p>
                                    <p>เวลา: {data.orderTime}</p>
                                </div>

                                {/* Order Status อยู่ชิดขอบล่างและอยู่ตรงกลาง */}
                                <p
                                    style={{
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        borderTop: "1px solid #ddd",
                                        paddingTop: "8px",
                                        color: statusColors[data.orderStatus] || "#000",
                                    }}
                                >
                                    {data.orderStatus}
                                </p>
                            </Paper>
                        </Button>
                    </Grid>

                ))
            ) : (
                <p>ไม่พบออเดอร์</p>
            )}
        </Grid>
    );
};

export default OrderList;
