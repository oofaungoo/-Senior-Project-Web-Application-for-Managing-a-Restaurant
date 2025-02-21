import React, { useState } from 'react';
import { HiPlusSm } from "react-icons/hi";
import Food from '../../../images/food.jpg';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { Grid2 } from '@mui/material';
import TextField from '@mui/material/TextField';

const MenuList = ({ data = [], category = [], onMenuClick, onAddNewMenu }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const filteredMenuItems = data.filter(item => {
        const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <Grid2 container spacing={2} style={{ backgroundColor: "#fff", width: "75%", height: "100vh", padding: "20px", borderRadius: "8px", overflowY: "auto" }}>
            {/* ค้นหาเมนูอาหาร */}
            <Grid2 xs={12}>
                <TextField
                    fullWidth
                    label="ค้นหาเมนูอาหาร"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Grid2>

            {/* ปุ่มกรองหมวดหมู่ */}
            <Grid2 xs={12} display="flex" justifyContent="center">
                <ButtonGroup variant="contained">
                    {category.map((cat) => (
                        <Button
                            key={cat._id}
                            onClick={() => setCategoryFilter(categoryFilter === cat.name ? '' : cat.name)}
                            style={{
                                backgroundColor: categoryFilter === cat.name ? '#1976d2' : '#e0e0e0',
                                color: categoryFilter === cat.name ? '#fff' : '#000',
                            }}
                        >
                            {cat.name}
                        </Button>
                    ))}
                </ButtonGroup>
            </Grid2>

            {/* รายการเมนู */}
            <Grid2 container spacing={2}>
                {/* ปุ่มเพิ่มเมนูใหม่ */}
                <Grid2 xs={6} md={4} lg={2}>
                    <Paper elevation={2} style={{ height: "100%", display: "flex", justifyContent: "center", backgroundColor: "#B2B2B2" }}>
                        <Button style={{ height: "100%", padding: 0, margin: 0, display: "flex" }} onClick={onAddNewMenu}>
                            <Grid2 container direction="column" alignItems="center" textAlign="center">
                                <HiPlusSm style={{ width: "100%", color: "black" }} className="fs-60" />
                                <p style={{ color: "black" }}>เพิ่มเมนูใหม่</p>
                            </Grid2>
                        </Button>
                    </Paper>
                </Grid2>

                {/* รายการเมนูที่กรองแล้ว */}
                {filteredMenuItems.map((item) => (
                    <Grid2 xs={6} md={4} lg={2} key={item._id} onClick={() => onMenuClick(item)}>
                        <Paper elevation={2} style={{ height: "100%" }}>
                            <Button style={{ height: "100%", padding: 0, margin: 0, display: "flex" }}>
                                <Grid2 container direction="column" style={{ padding: 10, height: "100%" }}>
                                    <img style={{ borderRadius: 5, marginBottom: 10, height: "5rem", width: "100%" }} src={item.image || Food} alt={item.name} />
                                    <p style={{ fontSize: 18, fontWeight: 4, color: '#000' }}>{item.name}</p>
                                    <p style={{ fontSize: 15, fontWeight: 4, color: '#777' }}>{item.sizePrices.map(size => size.size).join('/')}</p>
                                </Grid2>
                            </Button>
                        </Paper>
                    </Grid2>
                ))}
            </Grid2>

            {/* แสดงข้อความเมื่อไม่มีเมนูตรงกับการค้นหา */}
            {filteredMenuItems.length === 0 && (
                <Grid2 xs={12} textAlign="center" style={{ marginTop: 20, color: '#777' }}>
                    ไม่มีเมนูที่ตรงกับการค้นหา
                </Grid2>
            )}
        </Grid2>
    );
};

export default MenuList;
