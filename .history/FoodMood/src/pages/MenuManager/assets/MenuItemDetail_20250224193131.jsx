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
        <Stack height="100%" spacing={2}>
        {/* Header */}
        <Box>
            <div className="fs-24 fw-5 text-black">{selectedItem.name}</div>
            <div className="fs-16 text-dark-grey">{selectedItem.category}</div>
        </Box>

        {/* Scrollable Content */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", padding: "10px" }}>
            {/* Image Section */}
            <Box>
                <img
                    src={selectedItem.image || Food}
                    alt={selectedItem.name}
                    className="item-image"
                />
            </Box>

            {/* Size Selection */}
            <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                {selectedItem.sizePrices.map((item, index) => (
                    <Button
                        key={index}
                        variant={sizePrices.size === item.size ? "contained" : "outlined"}
                        onClick={() => handleSizeClick(item)}
                    >
                        {item.size}
                    </Button>
                ))}
            </Box>

            {/* Selected Size Details */}
            {selectedSize && (
                <Box>
                    <div>ราคา: {selectedSize.price} บาท</div>
                    <div>วัตถุดิบ:</div>
                    <ul>
                        {ingredients.map((ingredient, index) => (
                            <li key={index}>
                                {ingredient.newIngredient} - {ingredient.newIngredientQty} {ingredient.unit}
                            </li>
                        ))}
                    </ul>
                </Box>
            )}

            {/* Special Options Section */}
            {selectedItem.customOptions?.length > 0 && (
                <Box>
                    {selectedItem.customOptions.map((option, index) => (
                        <Box key={index}>
                            <div className="fs-18 fw-5">{option.label}</div>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {option.options.map((opt, i) => (
                                    <Box key={i} p={1} border="1px solid #ddd" borderRadius="8px">
                                        {opt}
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>

        {/* Fixed Action Buttons */}
        <Box display="flex" justifyContent="space-between" p={2} bgcolor="#fff" borderTop="1px solid #ddd">
            <Button variant="contained" color="primary" onClick={() => onEdit(selectedItem)}>
                แก้ไขรายละเอียด
            </Button>
            <Button variant="contained" color="error" onClick={() => handleClickConfirm(selectedItem)}>
                ลบเมนูทิ้ง
            </Button>
        </Box>
    </Stack>
    );
};

export default MenuItemDetail;
