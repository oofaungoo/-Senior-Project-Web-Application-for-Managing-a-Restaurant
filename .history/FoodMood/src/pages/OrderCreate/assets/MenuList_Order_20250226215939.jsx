import React, { useState } from 'react';
import Food from '../../../images/food.jpg';
import { Grid, Paper, Button } from '@mui/material';

const MenuList_Order = ({ data, category, onMenuClick, selectedItem }) => {
    const [searchQuery, setSearchQuery] = useState('');
        const [categoryFilter, setCategoryFilter] = useState('');
    
        // ✅ Filtering logic: Match category & search query
        const filteredMenuItems = data.filter(item => {
            const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

    return (
<>
            <Grid container>
                {/* Search Bar & Filters */}
                <input type="text" placeholder="ค้นหาเมนูอาหาร" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                <Grid item xs={12} style={{margin:"8px 0 8px"}}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {category.map((cat) => (
                            <div
                                key={cat._id}
                                className={`filter-bubble ${categoryFilter === cat.name ? 'active' : ''}`}
                                onClick={() => setCategoryFilter(categoryFilter === cat.name ? '' : cat.name)}
                            >
                                {cat.name}
                            </div>
                        ))}
                    </div>
                </Grid>
            </Grid>

            <Grid container spacing={1}>

                {/* รายการเมนู */}
                {filteredMenuItems.map((item) => (
                    <Grid item xs={6} md={4} lg={2} key={item._id} height={200} onClick={() => onMenuClick(item)}>
                        <Paper elevation={2} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <Button style={{ height: "100%", padding: 0, margin: 0, display: "flex", flexDirection: "column" }}>
                                <Grid container direction="column" style={{ height: "100%"}}>
                                    <img
                                        style={{ borderRadius: 5, marginBottom: 10, width: "100%", height:"6rem", objectFit: "cover", }}
                                        src={item.image || Food}
                                        alt={item.name}
                                    />
                                    <p style={{ fontSize: 18, fontWeight: 4, color: '#000000', textAlign: "left", padding: "0 10px 0" }}>{item.name}</p>
                                    <p style={{ fontSize: 15, fontWeight: 4, color: '#777777', textAlign: "left", padding: "0 10px 10px" }}>{item.sizePrices.map((size) => size.size).join("/")}</p>
                                </Grid>
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

        </>
    );
};

export default MenuList_Order;