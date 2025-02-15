import React, { useState } from 'react';
import { HiPlusSm } from "react-icons/hi";
import Food from '../../../images/food.jpg';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

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
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="ค้นหาเมนู"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

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

            <div className="menu-list">
                <Grid container spacing={1} >
                    <Grid item xs={6} md={4} lg={2} minHeight={200} >
                        <Paper elevation={2} style={{height:"100%",display:"flex",justifyContent:"center",backgroundColor:"#B2B2B2"}} >
                            <Button style={{height:"100%",width:"100%",padding:0,margin:0,display:"flex"}} onClick={() => onAddNewMenu()} >
                                <Grid container justifyContent={"center"} direction="column" textAlign={'center'}  >
                                    <HiPlusSm style={{width:"100%",color:"black"}} className='fs-60' />
                                    <p style={{color:"black",justifyContent:"center"}}>เพิ่มเมนูใหม่</p>
                                </Grid>
                            </Button>
                        </Paper>
                    </Grid>
                    {filteredMenuItems.map((item) => (
                        <Grid item xs={5} md={4} lg={2} key={item._id} minHeight={200} onClick={() => onMenuClick(item)} >
                                <Paper elevation={2} style={{height:"100%"}} >
                                <Button style={{height:"100%",padding:0,margin:0,display:"flex"}} >
                                    <Grid container  direction="column" style={{padding:10,height:"100%"}}>
                                        <img style={{borderRadius:5,marginBottom:10,height:"5rem", width:"100%",alignItems:'center'}} src={item.image || Food} alt={item.name} />
                                        <p style={{fontSize:18,fontWeight:5,color:'#000000'}}>{item.name}</p>
                                        <p style={{fontSize:15,fontWeight:3,color:'#777777' }}>{item.sizePrices.map(size => size.size).join('/')}</p>
                                    </Grid>
                                </Button>
                                </Paper>
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
