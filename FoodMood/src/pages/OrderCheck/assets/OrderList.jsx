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
    const backgroundColors = {
        "ยังไม่เริ่ม": "",
        "กำลังทำ": "#fffbf5",
        "พร้อมเสิร์ฟ": "#f8fdef",
    };
    const orderTypeColots = {
        "ทานที่ร้าน": "#64A2FF",
        "กลับบ้าน": "#ff7878",
        "Delivery": "#4CAF50",
        "สั่งแบบไม่ต้องจ่าย": "#ff63ff",
    }

    return (
        <Grid container spacing={1}>
            {orders?.length > 0 ? (
                orders.map((data) => (
                    <Grid item xs={12} md={4} lg={2} key={data.orderNumber}>
                        <Button style={{height: "100%", width: "100%", display: "flex"}}>
                            <Paper
                                sx={{
                                    width: "100%",
                                    height: 240,
                                    padding: "10px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    borderTop: `5px solid ${statusColors[data.orderStatus] || "#000"}`,
                                    backgroundColor: backgroundColors[data.orderStatus]
                                }}
                                onClick={() => selectOrder(data)}
                            >
                                {/* หมายเลขออเดอร์ตรงกลาง */}
                                <p
                                    style={{ fontSize: 24, textAlign: "center", fontWeight: "500", borderBottom: "1px solid #ddd", marginBottom: "8px"}}
                                >
                                    #{data.orderNumber}
                                </p>

                                {/* โต๊ะ/เบอร์โทร + วันที่ + เวลา */}
                                <div style={{ textAlign: "center", flex: 1 }}>
                                    <p style={{ color: orderTypeColots[data.orderType], fontWeight: 500, fontSize: 20 }}>{data.orderType}</p>
                                    <p>
                                        {data.contactInfo.tableNumber
                                            ? `โต๊ะที่ ${data.contactInfo.tableNumber}`
                                            : data.contactInfo.phoneNumber
                                                ? `โทร. ${data.contactInfo.phoneNumber}`
                                                : "ไม่ระบุโต๊ะหรือเบอร์โทร"}
                                    </p>
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
