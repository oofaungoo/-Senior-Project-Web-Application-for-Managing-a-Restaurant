import React, { useState, useEffect } from 'react';
import Food from '../../../images/food.jpg';
import { Box, Grid, Stack } from "@mui/material";

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
        setSelectedSize(item);  // ✅ เพิ่มบรรทัดนี้เพื่ออัปเดตขนาดที่เลือก
        setSizePrices(item);
        setIngredients(item.ingredients);
    };

    return (
        <Stack>
            {/* Header */}
            <Grid sx={{ borderBottom: "1px solid #ddd", marginBottom: "8px" }}>
                <p style={{ fontSize: 24 }}>{selectedItem.name}</p>
                <p style={{ color: "#777" }}>{selectedItem.category}</p>
            </Grid>

            {/* Content */}
            <Grid>
                {/* 1. Image */}
                <Grid item>
                    <img src={selectedItem.image || Food} alt={selectedItem.name} />
                </Grid>

                {/* 2. Size: can select size to see price & ingredient details */}
                <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1} paddingBottom={"8px"} borderBottom="1px solid #ddd">
                    {selectedItem.sizePrices.map((item, index) => (
                        <button
                            key={index}
                            className={`filter-bubble ${sizePrices.size === item.size ? 'active' : ''}`}
                            onClick={() => handleSizeClick(item)}
                            style={{ padding: "8px 16px", marginTop: "10px" }} // ปรับขนาดปุ่ม
                        >
                            {item.size}
                        </button>
                    ))}
                </Stack>

                {/* 3. Detail of selected size (from 2. Size) */}
                <Grid sx={{ borderBottom: "1px solid #ddd", marginBottom: "8px" }}>
                    <>
                        {selectedSize && (
                            <>
                                <p>ราคา: {selectedSize.price} บาท</p>
                                <p>วัตถุดิบ:</p>
                                <Grid>
                                    {ingredients.length > 0 ? (
                                        ingredients.map((ingredient, index) => (
                                            <li key={index}>
                                                {ingredient.newIngredient} - {ingredient.newIngredientQty} {ingredient.unit}
                                            </li>
                                        ))
                                    ) : (
                                        <p style={{ color: "#777", fontStyle: "italic" }}>
                                            ไม่ได้มีการระบุวัตถุดิบที่ใช้งานสำหรับขนาดนี้
                                        </p>
                                    )}
                                </Grid>

                            </>
                        )}
                    </>
                </Grid>
                {/* Special Options Section */}
                {selectedItem.customOptions && selectedItem.customOptions.length > 0 && (
                    <div className="special-options">
                        {selectedItem.customOptions.map((option, index) => (
                            <div key={index}>
                                <p style={{ fontSize: 18, fontWeight: 500 }}>{option.label}</p>
                                <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1} paddingBottom={"8px"}>
                                    {option.options.map((opt, i) => (
                                        <div key={i} className="option-box">
                                            {opt}
                                        </div>
                                    ))}
                                </Stack>
                            </div>
                        ))}
                    </div>
                )}
            </Grid>

            {/* Action Buttons */}
            <Grid display="flex" justifyContent="space-between" borderTop="1px solid #ddd">
                <button className="blue-button" onClick={() => onEdit(selectedItem)}>แก้ไขรายละเอียด</button>
                <button className="red-button" onClick={() => handleClickConfirm(selectedItem)}> ลบเมนูทิ้ง</button>
            </Grid>
        </Stack>
    );
};

export default MenuItemDetail;
