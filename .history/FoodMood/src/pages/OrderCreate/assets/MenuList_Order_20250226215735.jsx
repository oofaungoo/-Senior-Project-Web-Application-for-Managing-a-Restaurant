import React, { useState } from 'react';
import Food from '../../../images/food.jpg';

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
            <div className="menu-list">
                {/* ✅ Render only `filteredMenuItems` */}
                                {filteredMenuItems.map((item) => (
                                    <div
                                        key={item._id}  // Use `_id` instead of `index` for better stability
                                        className={`menu-item ${selectedItem?.name === item.name ? 'selected' : ''}`}
                                        onClick={() => onMenuClick(item)}
                                    >
                                        <img src={item.image || Food} alt={item.name} />
                                        <div className='fs-18 text-black'>{item.name}</div>
                                        <div className='fs-15 text-dark-grey'>
                                            {item.sizePrices.map(size => size.size).join('/')}
                                        </div>
                                    </div>
                                ))}
                
                                {/* ✅ Show message when no results */}
                                {filteredMenuItems.length === 0 && (
                                    <div className="no-results">ไม่มีเมนูที่ตรงกับการค้นหา</div>
                                )}
            </div>
        </div>
    );
};

export default MenuList_Order;