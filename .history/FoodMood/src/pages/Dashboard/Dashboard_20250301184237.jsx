import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './Dashboard.css';

import Food from '../../images/food.jpg';
import Drink from '../../images/drink.jpg';
import Fruit from '../../images/fruit.jpg';
import Appetizer from '../../images/Appetizer.jpg';

const Dashboard = () => {

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [timePeriod, setTimePeriod] = useState('daily'); // New state for time filter
    const [selectedGraph, setSelectedGraph] = useState('sales'); // New state for selected graph

    const menuData = [
        { name: 'ไก่ย่าง', sales: 5000, category: 'main', image: Food },
        { name: 'ชาเขียว', sales: 3000, category: 'drinks', image: Drink },
        { name: 'สตอร์เบอร์รี่เค้ก', sales: 2000, category: 'desserts', image: Fruit },
        { name: 'ข้าวโพดอบเนย', sales: 4000, category: 'appetizers', image: Appetizer },
    ];

    const ingredientData = [
        { name: 'ไก่ (สะโพก)', purchased: 300, used: 250 },
        { name: 'หมู (สับ)', purchased: 200, used: 240 },
        { name: 'หมู (สันใน)', purchased: 150, used: 120 },
        { name: 'ข้าวโพด', purchased: 100, used: 60 },
    ];

    const peakTimeData = [
        { time: '08:00', orders: 50, income: 2500 },
        { time: '09:00', orders: 80, income: 4000 },
        { time: '10:00', orders: 70, income: 3500 },
        { time: '11:00', orders: 90, income: 4500 },
        { time: '12:00', orders: 110, income: 5500 },
        { time: '13:00', orders: 130, income: 6500 },
        { time: '14:00', orders: 100, income: 5000 },
        { time: '15:00', orders: 60, income: 3000 },
    ];

    const filterOptions = [
        { label: 'All', value: 'all' },
        { label: 'เมนูจานหลัก', value: 'main' },
        { label: 'ของหวาน', value: 'desserts' },
        { label: 'Appetizers', value: 'appetizers' },
        { label: 'Drinks', value: 'drinks' },
    ];

    const timeOptions = [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
    ];

    const filteredMenuData = selectedCategory === 'all'
        ? menuData
        : menuData.filter(item => item.category === selectedCategory);

    const totalRevenue = filteredMenuData.reduce((acc, item) => acc + item.sales, 0);

    return (
        <div className='container'>
            <div className="middle-box">
                <div className="filters">
                    {filterOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setSelectedCategory(option.value)}
                            className={selectedCategory === option.value ? 'active-filter' : ''}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <div className="time-filters">
                    {timeOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setTimePeriod(option.value)}
                            className={timePeriod === option.value ? 'active-filter' : ''}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Conditional rendering based on selected graph */}
                <div className="charts">
                    {selectedGraph === 'sales' && (
                        <div className="bar-chart">
                            <div className='fs-18 fw-5 text-center'>ยอดขายตามเมนู (บาท)</div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={filteredMenuData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="sales" fill="#79adfc" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {selectedGraph === 'peakTime' && (
                        <div className="line-chart">
                            <div className='fs-18 fw-5 text-center'>Peak Time - Customer Orders & Income</div>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={peakTimeData}>
                                    <XAxis dataKey="time" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="orders" stroke="#8884d8" yAxisId="left" name="จำนวนออเดอร์" />
                                    <Line type="monotone" dataKey="income" stroke="#82ca9d" yAxisId="right" name="รายได้" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {selectedGraph === 'ingredient' && (
                        <div className="ingredient-chart">
                            <div className='fs-18 fw-5 text-center'>วัตถุดิบที่ซื้อมา ต่อวัตถุดิบที่ใช้ไป</div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={ingredientData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="purchased" fill="#f4b266" name="ซื้อมา" />
                                    <Bar dataKey="used" fill="#79adfc" name="ใช้ไป" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                    {/* Bottom Navigation for selecting graphs */}
            <div className="graph-nav">
                <button onClick={() => setSelectedGraph('sales')} className={selectedGraph === 'sales' ? 'active' : ''}>
                    ยอดขาย
                </button>
                <button onClick={() => setSelectedGraph('peakTime')} className={selectedGraph === 'peakTime' ? 'active' : ''}>
                    Peak Time
                </button>
                <button onClick={() => setSelectedGraph('ingredient')} className={selectedGraph === 'ingredient' ? 'active' : ''}>
                    วัตถุดิบ
                </button>
            </div>
                </div>
            </div>

            <div className='best-selling-right-box'>
                <div className='fs-20 fw-5 text-center right-box-header' style={{marginBottom:'10px'}}>เมนูขายดี</div>
                <ul className='best-selling-list'>
                    {filteredMenuData
                        .sort((a, b) => b.sales - a.sales)
                        .map(item => (
                            <li key={item.name}>
                                <img src={item.image} alt={item.name} />
                                <div className='fs-16 fw-5'>{item.name}</div>
                                <div className="sales-revenue">รายได้: {item.sales} ฿</div>
                                <div className="sales-quantity">ยอดขาย (จาน): {item.sales}</div>
                            </li>
                        ))}
                </ul>
            </div>

            
        </div>
    );
};

export default Dashboard;
