import React, { useState, useEffect } from 'react';
import { Grid, Stack, Box } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';

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
                <input type="number" value={editedPrice} placeholder="ระบุราคา" onChange={(e) => setEditedPrice(e.target.value)} onBlur={handleUpdatePrice} />
            </Grid>
            <Grid container mb={1}>
                <Grid item xs={12}>
                    <label>วัตถุดิบ</label>
                </Grid>

                {ingredients.map((ingredient, index) => (
  <Box
    key={index}
    sx={{
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "10px",
      marginBottom: "10px",
    }}
  >
    <Grid container spacing={1}>
      {/* บรรทัดที่ 1: วัตถุดิบ */}
      <Grid item xs={12}>
        <select
          className="form-select"
          value={ingredient.newIngredient}
          onChange={(e) => updateIngredientField(index, "newIngredient", e.target.value)}
          style={{ width: "100%" }}
        >
          <option disabled value="">วัตถุดิบ</option>
          {ingredientOptions.map((option, idx) => (
            <option key={idx} value={option.name}>{option.name}</option>
          ))}
        </select>
      </Grid>

      {/* บรรทัดที่ 2: ปริมาณ & หน่วย */}
      <Grid item xs={8}>
        <input
          type="number"
          placeholder="ปริมาณ"
          value={ingredient.newIngredientQty}
          onChange={(e) => updateIngredientField(index, "newIngredientQty", e.target.value)}
          style={{ width: "100%" }}
        />
      </Grid>

      <Grid item xs={4}>
        <select value={ingredient.unit} disabled style={{ width: "100%" }}>
          <option value="kg">กิโลกรัม</option>
          <option value="g">กรัม</option>
        </select>
      </Grid>
    </Grid>
  </Box>
))}

            </Grid>


            <Grid item xs={12} display="flex" justifyContent="center">
                <AddCircleIcon
                    type="button"
                    sx={{ color: "#62c965", cursor: "pointer" }}
                    onClick={handleAddMoreFields}
                />
            </Grid>



            <Grid display="flex" justifyContent="space-between" borderTop="1px solid #ddd" sx={{ paddingTop: "8px" }}>
                <button type="button" className="red-button" onClick={onBack}>
                    ย้อนกลับ
                </button>
                <button type="button" className="green-button" onClick={handleSave}>
                    บันทึก
                </button>
            </Grid>
        </>
    );
};

export default AddIngredient;
