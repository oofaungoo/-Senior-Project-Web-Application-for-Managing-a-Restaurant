import React, { useState, useEffect } from 'react';
import { Grid, Stack, Box } from "@mui/material";

const AddIngredient = ({
    currentSize,
    newSizePrice,
    ingredientOptions,
    onUpdateSizeName,
    onUpdatePrice,
    onBack,
    handleAddIngredient,
    ingredientMain
}) => {
    const [ingredients, setIngredients] = useState([
        {
            newIngredient: '',
            newIngredientQty: '',
            unit: 'kg'
        },
    ]);
    useEffect(() => {
        if (ingredientMain) {
            setIngredients(ingredientMain);
        }
    }, []);

    const [editedSizeName, setEditedSizeName] = useState(currentSize);
    const [editedPrice, setEditedPrice] = useState(newSizePrice);

    const [propIngredientOptions, setPropIngredientOptions] = useState(ingredientOptions);

    const handleAddMoreFields = () => {
        setIngredients([
            ...ingredients,
            { newIngredient: '', newIngredientQty: '', unit: 'kg' },
        ]);
    };

    const handleUpdateSizeName = () => {
        if (editedSizeName && editedSizeName !== currentSize) {
            onUpdateSizeName(currentSize, editedSizeName);
        }
    };

    const handleUpdatePrice = () => {
        console.log("Updating price:", editedSizeName, editedPrice);
        if (editedPrice && typeof onUpdatePrice === "function") {
            onUpdatePrice(editedSizeName, editedPrice);
        } else {
            console.error("onUpdatePrice is not a function or missing");
        }
    };


    const updateIngredientField = (index, field, value) => {
        const updatedIngredients = [...ingredients];
        if (field == "newIngredient") {
            const targetIngredient = propIngredientOptions.find(option => option.name === value);
            console.log('targetIngredient:', targetIngredient);
            updatedIngredients[index][field] = value;
            updatedIngredients[index]["unit"] = targetIngredient.unit;

        } else {
            updatedIngredients[index][field] = value;
        }
        console.log('index:', index);
        console.log('value:', value);
        console.log('Updated Ingredients:', updatedIngredients);

        setIngredients(updatedIngredients);
    };

    const handleSave = () => {
        const dataToSave = {
            sizeName: editedSizeName,
            price: editedPrice,
            ingredients: ingredients,
        };
        handleAddIngredient(dataToSave);
        onBack();
    };

    return (
        <>
            <Grid sx={{ borderBottom: "1px solid #ddd", marginBottom: "8px", paddingBottom: "8px" }}>
                <p style={{ fontSize: 18, fontWeight: 500, justifyContent: "center" }}>จัดการวัตถุดิบ</p>
            </Grid>
            <Grid mb={1}>
                <label>ขนาด</label>
                <input type="text" value={editedSizeName} onChange={(e) => setEditedSizeName(e.target.value)} disabled />
            </Grid>
            <Grid mb={1}>
                <label>ราคา</label>
                <input type="number" value={editedPrice} placeholder="ระบุราคา" onChange={(e) => setEditedPrice(e.target.value)} onBlur={handleUpdatePrice}/> 
            </Grid>

            <div style={{ marginTop: "10px" }}>
                <label> </label>
                
            </div>
            <div style={{ marginTop: "10px" }}>
                <label>วัตถุดิบ</label>
                {ingredients.map((ingredient, index) => (
                    <div key={index} className="inline-elements" style={{ marginBottom: "10px" }}>
                        <select
                            className="form-select"
                            value={ingredient.newIngredient}
                            onChange={(e) =>
                                updateIngredientField(index, 'newIngredient', e.target.value)
                            }
                        >
                            <option disabled value="">เลือกวัตถุดิบ</option>
                            {ingredientOptions.map((option, idx) => (
                                <option key={idx} value={option.name}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="ปริมาณ"
                            value={ingredient.newIngredientQty}
                            onChange={(e) =>
                                updateIngredientField(index, 'newIngredientQty', e.target.value)
                            }
                        />
                        <select
                            value={ingredient.unit}
                            disabled
                            onChange={(e) =>
                                updateIngredientField(index, 'unit', e.target.value)
                            }

                        >
                            <option value="kg">กิโลกรัม</option>
                            <option value="g">กรัม</option>
                        </select>
                    </div>
                ))}
            </div>

            <div>
                <button className="circle-plus-btn" onClick={handleAddMoreFields}>+</button>
            </div>

            <div className="order-action-buttons">
                <button type="button" className="red-button" onClick={onBack}>
                    ย้อนกลับ
                </button>
                <button type="button" className="blue-button" onClick={handleSave}>
                    บันทึก
                </button>
            </div>
        </>
    );
};

export default AddIngredient;
