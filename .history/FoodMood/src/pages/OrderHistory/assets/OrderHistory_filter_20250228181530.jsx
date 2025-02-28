// OrderHistory_filter.jsx
import React from 'react';
import dayjs from "dayjs";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";

const OrderHistory_filter = ({ orderDate, orderTimeStart, orderTimeEnd, handleDateChange, handleTimeStartChange, handleTimeEndChange }) => {
    return (
        <div className='inline-elements'>
            {/* Date Picker */}
            <div>
                <label htmlFor="orderDate">วันที่</label>
                <input
                    type="date"
                    id="orderDate"
                    value={orderDate}
                    onChange={handleDateChange}
                />
            </div>

            {/* Time Picker for Start Time */}
            <div>
                <label htmlFor="orderTimeStart">ระหว่างช่วงเวลา (Start)</label>
                <input
                    type="time"
                    id="orderTimeStart"
                    value={orderTimeStart}
                    onChange={handleTimeStartChange}
                />
            </div>

            {/* Time Picker for End Time */}
            <div>
                <label htmlFor="orderTimeEnd">ระหว่างช่วงเวลา (End)</label>
                <input
                    type="time"
                    id="orderTimeEnd"
                    value={orderTimeEnd}
                    onChange={handleTimeEndChange}
                />
            </div>
        </div>
    );
};

export default OrderHistory_filter;
