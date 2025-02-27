import React, { useState, useEffect } from "react";
import { Box, Modal, useMediaQuery } from "@mui/material";
import "./OrderCheck.css";
import axios from "axios";
import OrderList from "./assets/OrderList";
import OrderDetail from "./assets/OrderDetail";

const OrderCheck = () => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1040px)");

    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [filterStatus, setFilterStatus] = useState(["all"]);
    const [filterCategory, setFilterCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // API: Fetch data from server
    useState(() => {
        axios.get("http://localhost:5000/api/orders")
            .then((res) => {
                console.log(res.data);
                setData(res.data);
            })
            .catch((err) => console.error("Error fetching orders:", err));
    }, []);

    const updateOrder = (orderId, newStatus) => {
        setData(prevData => prevData.map(order =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
        ));
        if (selectedData && selectedData._id === orderId) {
            setSelectedData(prev => ({ ...prev, orderStatus: newStatus }));
        }
    };

    const statusOptions = [
        { id: "all", name: "ทั้งหมด" },
        { id: 1, name: "ยังไม่เริ่ม" },
        { id: 2, name: "กำลังทำ" },
        { id: 3, name: "พร้อมเสิร์ฟ" },
    ];

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
        const excludedStatuses = ["เสร็จสิ้น", "ยกเลิก"];
        const matchesStatus = filterStatus.includes("all") || filterStatus.includes(order.status);
        const matchesCategory = filterCategory === "all" || order.items.some((item) => item.category === filterCategory);
        const matchesSearch = searchQuery === "" || (order.orderNumber && String(order.orderNumber).includes(searchQuery));
    
        return matchesStatus && matchesCategory && matchesSearch && !excludedStatuses.includes(order.orderStatus);
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
        <>
            {/* Box ของ MenuList */}
            <Box
                sx={{ backgroundColor: "#fff", width: isMobile ? "100%" : isTablet ? "65%" : "75%", height: "100vh", padding: "20px", borderRadius: "8px", overflowY: "auto", marginRight: "10px",}}
            >
                {/* Search Bar */}
                <div className="search-bar">
                    <input type="text" placeholder="ค้นหาด้วยเลขออเดอร์" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>

                {/* Status Filter */}
                <div className="filter-bubble-container" style={{ marginTop: "10px" }}>
                    {statusOptions.map((option) => (
                        <div key={option.id} style={{whiteSpace: "nowrap"}} className={`filter-bubble ${filterStatus.includes(option.id) ? "active" : "" }`}
                            onClick={() => handleStatusChange(option.id)}
                        >
                            {option.name}
                        </div>
                    ))}
                </div>

                {/* Order List */}
                <OrderList orders={filteredOrders} selectOrder={selectOrder} />
            </Box>

            {/* Desktop & Tablet: แสดง AddMenu และ MenuItemDetail ด้านขวา */}
            {!isMobile && (selectedData) && (
                <Box
                    sx={{
                        backgroundColor: "#fff",
                        width: isTablet ? "35%" : "25%", // Box ของ Tablet = 30%, Desktop = 25%
                        height: "100vh",
                        padding: "20px",
                        borderRadius: "8px",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {selectedData && (
                        <OrderDetail
                            selectedOrder={selectedData}
                            onClose={() => setSelectedData(null)}
                            updateOrder={updateOrder} />
                    )}
                </Box>
            )}

            {/* Mobile - ใช้ Modal */}
            {isMobile && (
                <Modal
                    open={selectedData}
                    onClose={() => {
                        setSelectedData(false);
                    }}
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
                        {selectedData && (
                            <OrderDetail
                                selectedOrder={selectedData}
                                onClose={() => setSelectedData(null)}
                                updateOrder={updateOrder} />
                        )}
                    </Box>
                </Modal>
            )}
        </>
    );
};

export default OrderCheck;
