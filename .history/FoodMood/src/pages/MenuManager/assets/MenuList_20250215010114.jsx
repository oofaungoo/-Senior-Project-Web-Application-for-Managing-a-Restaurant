import React, { useState } from 'react';
import { HiPlusSm } from "react-icons/hi";
import Food from '../../../images/food.jpg';
import Grid from '@mui/material/Grid';

const MenuList = ({ data = [], category = [], onMenuClick, onAddNewMenu, selectedItem }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    // ✅ Filtering logic: Match category & search query
    const filteredMenuItems = data.filter(item => {
        const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="middle-box">
            {/* ✅ Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="ค้นหาเมนู"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* ✅ Filter Bubbles */}
            <div className="filter-bubble-container" style={{ marginTop: '10px' }}>
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

            {/* ✅ Filtered Menu List */}
            <div className="menu-list">
                {/* Add New Menu Button */}
                

                {/* ✅ Render only `filteredMenuItems` */}
                <Grid container spacing={2}>
                    <Grid item xs={6} md={4} lg={2} onClick={onAddNewMenu}>
                        <Grid container justifyContent={"center"} direction="column" textAlign={'center'}   >
                            <HiPlusSm  fontSize={50} style={{alignContent:"center"}} />
                            <p >เพิ่มเมนูใหม่</p>
                        </Grid>
                    </Grid>
                    {filteredMenuItems.map((item) => (
                        <Grid item xs={6} md={4} lg={2} key={item._id} onClick={() => onMenuClick(item)} >
                            <Grid container style={{padding:10}}>
                                <img src={item.image || Food} alt={item.name} />
                                <div>{item.name}</div>
                                <div>{item.sizePrices.map(size => size.size).join('/')}</div>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
                

                {/* ✅ Show message when no results */}
                {filteredMenuItems.length === 0 && (
                    <div className="no-results">ไม่มีเมนูที่ตรงกับการค้นหา</div>
                )}
            </div>
        </div>
    );
};

export default MenuList;
