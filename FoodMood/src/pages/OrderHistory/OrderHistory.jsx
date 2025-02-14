import React, { useState, useEffect } from 'react';
import OrderHistory_filter from './assets/OrderHistory_filter';
import OrderHistory_table from './assets/OrderHistory_table';

const OrderHistory = () => {

    const [orderDate, setOrderDate] = useState('');
    const [orderTimeStart, setOrderTimeStart] = useState('');
    const [orderTimeEnd, setOrderTimeEnd] = useState('');

    // Handle changes in date and time inputs
    const handleDateChange = (e) => setOrderDate(e.target.value);
    const handleTimeStartChange = (e) => setOrderTimeStart(e.target.value);
    const handleTimeEndChange = (e) => setOrderTimeEnd(e.target.value);

    return (
        <div className='container'>
            <div className="middle-box">
                <OrderHistory_filter
                    orderDate={orderDate}
                    orderTimeStart={orderTimeStart}
                    orderTimeEnd={orderTimeEnd}
                    handleDateChange={handleDateChange}
                    handleTimeStartChange={handleTimeStartChange}
                    handleTimeEndChange={handleTimeEndChange}
                />
                <OrderHistory_table />
            </div>
        </div>
    );
};

export default OrderHistory;

