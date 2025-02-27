import React, { useState, useEffect } from 'react';
import { Grid, Stack } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

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
        // console.log("ingredientRemain : ", ingredientRemain)
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
        <Stack sx={{ minHeight: "100%", display: "flex" }}>
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

                <Grid container sx={{display: "flex",alignItems: "center",}}>
                    <p>ขนาด</p>
                    <div className="option-box-container">
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
                    </div>
                </Grid>
                <li className="option-item">
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <p>รายละเอียดวัตถุดิบที่ใช้ ต่อ คงเหลือ</p>
                        </Grid>
                        {ingredientList.length === 0
                            ? <Grid item xs={12}>
                                <p>ไม่มีวัตถุดิบ</p>
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
                </li>


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
            </Grid>

            {/* Action Buttons */}
            <Grid display="flex" justifyContent="space-between" borderTop="1px solid #ddd" sx={{ marginTop: "auto", paddingTop: "8px" }}>
                <button className='red-button' onClick={onClose}>ยกเลิก</button>
                <button className='blue-button' onClick={handleConfirmAdd}>เพิ่มเข้าคำสั่งซื้อ</button>
            </Grid>
        </Stack>
    );
};

export default MenuItemSelected;
