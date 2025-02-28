// OrderHistory_filter.jsx
import React from 'react';
import dayjs from "dayjs";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";

const OrderHistory_filter = ({ orderDate, orderTimeStart, orderTimeEnd, handleDateChange, handleTimeStartChange, handleTimeEndChange }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="inline-elements">
                {/* Date Picker */}
                <div>
                    <label>วันที่</label>
                    <DatePicker
                        value={orderDate ? dayjs(orderDate) : null}
                        onChange={(newValue) => handleDateChange(newValue ? newValue.format("YYYY-MM-DD") : "")}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </div>

                {/* Time Picker for Start Time */}
                <div>
                    <label>ระหว่างช่วงเวลา (Start)</label>
                    <TimePicker
                        value={orderTimeStart ? dayjs(orderTimeStart, "HH:mm") : null}
                        onChange={(newValue) => handleTimeStartChange(newValue ? newValue.format("HH:mm") : "")}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </div>

                {/* Time Picker for End Time */}
                <div>
                    <label>ระหว่างช่วงเวลา (End)</label>
                    <TimePicker
                        value={orderTimeEnd ? dayjs(orderTimeEnd, "HH:mm") : null}
                        onChange={(newValue) => handleTimeEndChange(newValue ? newValue.format("HH:mm") : "")}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </div>
            </div>
        </LocalizationProvider>
    );
};

export default OrderHistory_filter;