import React, { useState } from "react";
import OrderDetail from "./assets/OrderDetail";
import "./OrderCheck.css";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { Paper } from "@mui/material";

const OrderCheck = () => {
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [foodCategory, setFoodCategory] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);
    const [filterStatus, setFilterStatus] = useState(["all"]);
    const [filterCategory, setFilterCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // API: Fetch data from server
    useState(() => {
        axios
            .get("http://localhost:5000/api/orders")
            .then((res) => {
                console.log(res.data);
                setData(res.data);
            })
            .catch((err) => console.error("Error fetching orders:", err));

        axios
            .get("http://localhost:5000/api/add_menus/category")
            .then((res) => {
                setFoodCategory(res.data);
            })
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    const statusOptions = [
        { id: "all", name: "ทั้งหมด" },
        { id: 1, name: "ยังไม่เริ่ม" },
        { id: 2, name: "กำลังทำ" },
        { id: 3, name: "พร้อมเสิร์ฟ" },
        { id: 4, name: "เสร็จสิ้น" },
        { id: 5, name: "ยกเลิก" },
    ];

    const statusColors = {
        "ยังไม่เริ่มทำ": "#FF9800", // Orange
        "กำลังทำ": "#2196F3", // Blue
        "พร้อมเสิร์ฟ": "#4CAF50", // Green
        "เสร็จสิ้น": "#9E9E9E", // Grey
        "ยกเลิก": "#F44336", // Red
    };

    const handleStatusChange = (statusId) => {
        if (statusId === "all") {
            setFilterStatus(["all"]);
        } else {
            if (filterStatus.includes("all")) {
                setFilterStatus([statusId]);
            } else {
                setFilterStatus((prev) =>
                    prev.includes(statusId)
                        ? prev.filter((id) => id !== statusId)
                        : [...prev, statusId]
                );
            }
        }
    };

    const filteredOrders = data.filter((order) => {
        if (filterStatus.includes("all") || filterStatus.includes(order.status)) {
            if (filterCategory === "all") {
                return true;
            }
            return order.items.some((item) => item.category === filterCategory);
        }
        return false;
    });

    const selectOrder = (order) => {
        setSelectedData(order);
    };

    const removeItem = (itemName) => {
        if (selectedData) {
            const updatedItems = selectedData.items.filter(
                (item) => item.name !== itemName
            );
            setSelectedData({ ...selectedData, items: updatedItems });
        }
    };

    return (
        <div className="container">
            <div className="middle-box">
                {/* Search Bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="ค้นหาออเดอร์"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Status Filter */}
                <div className="filter-bubble-container" style={{ marginTop: "10px" }}>
                    สถานะออเดอร์:
                    {statusOptions.map((option) => (
                        <div
                            key={option.id}
                            className={`filter-bubble ${filterStatus.includes(option.id) ? "active" : ""
                                }`}
                            onClick={() => handleStatusChange(option.id)}
                        >
                            {option.name}
                        </div>
                    ))}
                </div>
                {/* Order List */}
                <Grid container spacing={1}>
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((data) => (
                            <Grid item xs={6} md={4} lg={2} key={data.orderNumber}>
                                <Paper sx={{ minHeight: 200, padding: 2, borderTop: `5px solid ${statusColors[data.orderStatus] || "#000"}` }}>
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
            </div>

            {/* Display OrderDetail if an order is selected */}
            {selectedData && (
                <div className="right-box">
                    <OrderDetail
                        selectedOrder={selectedData}
                        removeItem={removeItem}
                        onClose={() => setSelectedData(null)}
                    />
                </div>
            )}
        </div>
    );
};

export default OrderCheck;
