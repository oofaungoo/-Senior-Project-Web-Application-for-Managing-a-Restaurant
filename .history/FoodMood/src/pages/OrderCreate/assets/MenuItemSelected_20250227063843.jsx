import React, { useState, useEffect } from 'react';
import { Grid, Stack } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

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
    setNote,
    ingredientRemain,
    onClose
}) => {
    const [selectSize, setSelectedSize] = useState({});
    const [ingredientList, setIngredientList] = useState([]);
    const [ingredientRemainList, setIngredientRemainList] = useState([]);
    const [ingredientOverStock, setIngredientOverStock] = useState(false);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        setSelectedSize(selectedItem.sizePrices[0])
        setIngredientList(selectedItem.sizePrices[0].ingredients);
        handleSizeChange(selectedItem.sizePrices[0].size)

        const remain = selectedItem.sizePrices[0].ingredients.map((acc) => {
            const ingredient = ingredientRemain.find((acc2) => acc.newIngredient === acc2.name)
            return ingredient
        })
        setIngredientRemainList(remain)
    }, [selectedItem]);

    const handleOptionChange = (optionGroup, option) => {
        setSelectedOptions(prevOptions => ({
            ...prevOptions,
            [optionGroup]: option
        }));
    };

    const handleSelectSize = (acc) => {
        const value = JSON.parse(acc)
        handleSizeChange(value.size)
        console.log("เลือกขนาด : ", value)
        setSelectedSize(value);
        setIngredientList(value.ingredients);


        // console.log("ingredientRemain2 : ", ingredientRemain)
        const remain = value.ingredients.map((acc) => {
            const ingredient = ingredientRemain.find((acc2) => acc.newIngredient === acc2.name)
            return ingredient
        })
        setIngredientRemainList(remain)
        // checkIngredientOverStock(value.ingredients,ingredientRemainList)

    }

    const checkIngredientOverStock = (ingredientList, ingredientRemainList) => {
        const check = ingredientList.map((acc, index) => {
            if (acc.newIngredientQty * quantity > ingredientRemainList[index].remain) {
                return true
            } else {
                return false
            }
        })
        console.log("check : ", check)
        setIngredientOverStock(check)
    }

    return (
        <>
            {/* Header */}
            <Grid container sx={{ borderBottom: "2px solid #ddd", marginBottom: "8px", paddingBottom: "8px" }}>
                <Grid item xs={11}>
                    <p style={{ fontSize: 24 }}>{selectedItem.name}</p>
                </Grid>
                <Grid item xs={1}>
                    <CloseIcon style={{ fontSize: 18, color: "#ff4b4b", cursor: "pointer" }} onClick={() => onClose()} />
                </Grid>
                <p style={{ color: "#777" }}>{selectedItem.category}</p>
            </Grid>

            {/* Content */}
            <Grid sx={{ flexGrow: 1 }}>

                {/* 1. เลือกขนาด */}
                <Grid container sx={{ display: "flex", alignItems: "center", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #ddd" }}>
                    <Grid item xs={2}>
                        <p>ขนาด</p>
                    </Grid>
                    <Grid item xs={10} sx={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: "8px" }}>
                        {selectedItem?.sizePrices?.map((acc, index) => (
                            <label
                                key={index}
                                className={`option-box ${selectedSize === acc.size ? 'selected' : ''}`}
                            >
                                <input
                                    type="radio"
                                    value={acc.size}
                                    checked={selectedSize === acc.size}
                                    onChange={() => handleSelectSize(JSON.stringify(acc))}
                                />
                                {acc.size}
                            </label>
                        ))}
                    </Grid>
                </Grid>

                {/* 2. แสดงรายละเอียดการใช้วัตถุดิบ */}
                <Grid container spacing={1} sx={{ display: "flex", alignItems: "center", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #ddd" }}>
                    <Grid item xs={12}>
                        <p>รายละเอียดวัตถุดิบที่ใช้ ต่อ คงเหลือ</p>
                    </Grid>
                    {ingredientList.length === 0
                        ? <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                            <p style={{ color: "#777", fontStyle: "italic", textAlign: "center" }}>
                                ไม่มีการใช้วัตถุดิบ
                            </p>
                        </Grid>
                        : <>
                            {ingredientList.map((acc, index) => (
                                <Grid key={index} item xs={12} style={{ paddingLeft: '10%' }}>
                                    <Grid container justifyContent={'space-between'}>
                                        <Grid item xs={6}>
                                            <p>{acc.newIngredient}</p>
                                        </Grid>
                                        <Grid item xs={5} display={'flex'} justifyContent={'flex-end'} style={{ paddingRight: '5%' }}>
                                            <p>{(acc.newIngredientQty * quantity).toFixed(2)}/</p><p style={{ color: (acc.newIngredientQty * quantity) > ingredientRemainList[index].remain ? "red" : "black" }}>{ingredientRemainList[index].remain}</p>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <p>{acc.unit}</p>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            ))}
                        </>
                    }
                </Grid>

                {/* 3. ระบุจำนวนที่จะสั่ง (มีการ sync วัตถุดิบด้วยในทุกเมนูที่เลือก) */}
                <Grid container spacing={1} sx={{ display: "flex", alignItems: "center", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #ddd" }}>
                    {/* Label "จำนวน" */}
                    <Grid item xs={2}>
                        <p>จำนวน</p>
                    </Grid>

                    {/* ปุ่มลด-เพิ่มจำนวน */}
                    <Grid item xs={10} sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                        <button
                            onClick={handleQuantityDecrease}
                            className="quantity-left-btn"
                            disabled={quantity === 1}
                        >
                            -
                        </button>
                        <span>{quantity}</span>
                        <button onClick={handleQuantityIncrease} className="quantity-right-btn">+</button>
                    </Grid>
                </Grid>


                {/* 4. เลือก Special Options */}
                {Array.isArray(selectedItem?.customOptions) && selectedItem.customOptions.length > 0 && (
                    <Grid container spacing={1} sx={{ display: "flex", alignItems: "center", marginTop: "8px", marginBottom: "8px", borderBottom: "1px solid #ddd" }}>
                        {selectedItem.customOptions.map((customOption) => (
                            <Grid key={customOption._id} sx={{ marginBottom: "8px" }}> {/* ✅ เพิ่มระยะห่างแต่ละ option */}
                                <p>{customOption.label}</p> {/* ✅ เพิ่มระยะห่างระหว่าง label กับ options */}
                                <Grid style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}> {/* ✅ ให้ option เว้นระยะห่าง */}
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
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* 5. ระบุโน๊ต หรือ หมายเหตุ */}
                <Grid>
                    <p>รายละเอียดเพิ่มเติม</p>
                    <textarea type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="เช่น ไม่ใส่ถั่ว ไม่เอาผัก" style={{ width: "100%", height: "70px", minHeight: "70px", resize: "vertical", border: "1px solid #ccc", borderRadius: "4px", padding: "8px", fontSize: "16px", fontFamily: "inherit" }} />
                </Grid>
            </Grid>

            {/* Action Buttons */}
            <Grid display="flex" justifyContent="space-between" borderTop="1px solid #ddd" sx={{ marginTop: "auto", paddingTop: "8px" }}>
                <button className='red-button' onClick={onClose}>ยกเลิก</button>
                <button className='blue-button' onClick={handleConfirmAdd}>เพิ่มเข้าคำสั่งซื้อ</button>
            </Grid>
        </>
    );
};

export default MenuItemSelected;
