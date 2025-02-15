import React from 'react';

const OrderList = ({ orders, selectOrder }) => {
    return (
        <Grid container spacing={1}>
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((data) => (
                            <Grid item xs={6} md={4} lg={2} key={data.orderNumber}>
                                <Paper sx={{ minHeight: 200, padding: 2, borderTop: `5px solid ${statusColors[data.orderStatus] || "#000"}` }}>
                                    <p className="right-box-header fs-20 fw-5 text-center">ออเดอร์ที่ {data.orderNumber}</p>

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
