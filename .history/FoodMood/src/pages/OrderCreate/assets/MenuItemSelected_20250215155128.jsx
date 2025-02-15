import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';

const MenuItemSelected = ({
    selectedItem,
    selectedSize,
    quantity,
    note,
    selectedOptions,
    setSelectedOptions,
    handleSizeChange,
    handleQuantityIncrease,
    handleQuantityDecrease,
    handleConfirmAdd,
    setNote
}) => {
    const [selectSize, setSelectedSize] = useState({});

    const handleOptionChange = (optionGroup, option) => {
        setSelectedOptions(prevOptions => ({
            ...prevOptions,
            [optionGroup]: option
        }));
    };
    const handleSelectSize = (size) => {
        setSelectedSize(size);
    }
    return (
        <div>
            <div className="right-box-header">
                <div className='fs-24 fw-5 text-black'>{selectedItem.name}</div>
                <div className='fs-16 text-dark-grey'>{selectedItem.category}</div>
            </div>
            <div className="right-box-header">
                {/* <img src={selectedItem.image} alt={selectedItem.name} className="item-image" /> */}
            </div>


            <ul>
                {/* แสดงตัวเลือกขนาด (size) */}
                <li className="option-item">
                    <div>ขนาด</div>
                    {selectedItem?.sizePrices?.map(({ size }) => (
                        <Grid >
                            <label
                                key={size}
                                className={`option-box ${selectedSize === size ? 'selected' : ''}`}
                            >
                                <input
                                    type="radio"
                                    value={size}
                                    checked={selectedSize === size}
                                    onChange={() => handleSizeChange(size)}
                                />
                                {size}
                            </label>
                            

                        </Grid>
                    ))}
                </li>
                <div>
                    <p>รายละเอียดวัตถุดิบที่ใช้</p>
                    <ul>
                    </ul>
                </div>


                {/* เลือกจำนวนที่ต้องการ */}
                <li className="option-item">
                    <div>จำนวน</div>
                    <div className="quantity-div">
                        <button
                            onClick={handleQuantityDecrease}
                            className="quantity-left-btn"
                            disabled={quantity === 1}
                        >
                            -
                        </button>
                        <span>{quantity}</span>
                        <button onClick={handleQuantityIncrease} className="quantity-right-btn">+</button>
                    </div>
                </li>

                {/* Special Options */}
                {Array.isArray(selectedItem?.customOptions) && selectedItem.customOptions.map((customOption) => (
                    <li key={customOption._id}>
                        <div style={{ marginLeft: '6px' }}>{customOption.label}</div>
                        <div className="option-box-container">
                            {Array.isArray(customOption.options) && customOption.options.map((option) => (
                                <label
                                    key={option}
                                    className={`option-box ${selectedOptions[customOption.label] === option ? 'selected' : ''}`}
                                    onClick={() => handleOptionChange(customOption.label, option)}
                                >
                                    <input
                                        type="radio"
                                        name={customOption.label}
                                        value={option}
                                        checked={selectedOptions[customOption.label] === option}
                                        onChange={() => handleOptionChange(customOption.label, option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </li>
                ))}

                {/* ระบุโน๊ต หรือ หมายเหตุ */}
                <li className="option-item-column">
                    <div style={{ marginTop: "8px" }}>รายละเอียดเพิ่มเติม</div>
                    <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="เช่น ไม่ใส่ถั่ว ไม่เอาผัก"
                        className="note-input"
                    />
                </li>
            </ul>

            <div className="menu-action-buttons">
                <button className='red-button'>ยกเลิก</button>
                <button className='blue-button' onClick={handleConfirmAdd}>เพิ่มเข้าคำสั่งซื้อ</button>
            </div>
        </div>
    );
};

export default MenuItemSelected;
