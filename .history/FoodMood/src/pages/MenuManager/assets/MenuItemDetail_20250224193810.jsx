import React, { useState, useEffect } from 'react';
import Food from '../../../images/food.jpg';
import { Box, Button, Stack } from "@mui/material";

const MenuItemDetail = ({ selectedItem, onEdit, handleClickConfirm }) => {
    const [selectedSize, setSelectedSize] = useState({});
    const [sizePrices, setSizePrices] = useState({});
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        setSelectedSize(selectedItem.sizePrices[0])
        handleSizeClick(selectedItem.sizePrices[0])
        setSizePrices(selectedItem.sizePrices[0])
        setIngredients(selectedItem.sizePrices[0].ingredients)
    }, [selectedItem]);

    const handleSizeClick = (item) => {
        setSizePrices(item);
        setIngredients(item.ingredients)
    };

    return (
        <Stack>
            {/* Header Section */}
            <Box sx={{borderBottom: "1px solid #ddd", marginBottom: "8px"}}>
                <p style={{fontSize: 24}}>{selectedItem.name}</p>
                <p style={{fontSize: 16, color: "#777"}}>{selectedItem.category}</p>
            </Box>

            {/* Content */}
            <div className="right-box-header">
                <img
                    src={selectedItem.image || Food}
                    alt={selectedItem.name}
                    className="item-image"
                />
            </div>

            {/* Size Selection */}
            <div className="filter-bubble-container">
                {selectedItem.sizePrices.map((item, index) => (
                    <button
                        key={index}
                        className={`filter-bubble ${sizePrices.size == item.size ? 'active' : ''}`}
                        onClick={() => handleSizeClick(item)}
                        style={{ marginTop: '10px' }}
                    >
                        {item.size}
                    </button>
                ))}
            </div>

            {/* Selected Size Details */}
            <div className="right-box-header">
                <>
                    {selectedSize && (
                        <>
                            <div>ราคา: {selectedSize.price} บาท</div>
                            <div>วัตถุดิบ:</div>
                            <ul className="ingredient-ul">

                                {ingredients.map((ingredient, index) => (
                                    <li key={index}>
                                        {ingredient.newIngredient} - {ingredient.newIngredientQty} {ingredient.unit}
                                    </li>
                                ))}

                            </ul>
                        </>
                    )}
                </>
            </div>
            {/* Special Options Section */}
            {selectedItem.customOptions && selectedItem.customOptions.length > 0 && (
                <div className="special-options">
                    {selectedItem.customOptions.map((option, index) => (
                        <div key={index} className="special-option-group">
                            <div className="fs-18 fw-5">{option.label}</div> {/* หัวข้อ เช่น ระดับความหวาน */}
                            <div className="option-box-container">
                                {option.options.map((opt, i) => (
                                    <div key={i} className="option-box">
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Action Buttons */}
            <Box display="flex" justifyContent="space-between" p={2} bgcolor="#fff" borderTop="1px solid #ddd">
                <button className="blue-button" onClick={() => onEdit(selectedItem)}>แก้ไขรายละเอียด</button>
                <button className="red-button" onClick={() => handleClickConfirm(selectedItem)}> ลบเมนูทิ้ง</button>
            </Box>
        </Stack>
    );
};

export default MenuItemDetail;
