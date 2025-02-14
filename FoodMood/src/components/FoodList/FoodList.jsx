import React from 'react';
import './FoodList.css';

const FoodList = () => {
    return (
        <div className="food-list">
            <h2>เมนูขายดีประจำวัน</h2>
            <div className="categories">
                <button className="active">All Categories</button>
                <button>เมนูจานหลัก</button>
                <button>ของทานเล่น</button>
                <button>เครื่องดื่ม</button>
                <button>ขนมหวาน</button>
            </div>
            <div className="food-items">
                <div className="food-item">
                    <img alt="ไก่ย่าง" />
                    <p>ไก่ย่าง</p>
                </div>
                <div className="food-item">
                    <img alt="ชาเขียวเย็น" />
                    <p>ชาเขียวเย็น</p>
                </div>
            </div>
        </div>
    );
}

export default FoodList;
