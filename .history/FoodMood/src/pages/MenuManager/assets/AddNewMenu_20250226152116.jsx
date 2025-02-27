import React, { useState, useEffect } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import './AddNewMenu.css';
import AddIngredient from './AddIngredient';
import axios from 'axios';
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
import { Grid, Stack } from "@mui/material";

const AddNewMenu = ({ form, dataToEdit, onCancel, setShowItemDetail }) => {
    const [menuName, setMenuName] = useState('');
    const [category_id, setCategory_id] = useState('1');
    const [category, setCategory] = useState('1');
    const [sizePrices, setSizePrices] = useState([]);
    const [newSize, setNewSize] = useState('ปกติ');
    const [newSizePrice, setNewSizePrice] = useState('');

    //อัปโหลด url รูปภาพ
    const MySwal = withReactContent(Swal);
    const [imageUrl, setImageUrl] = useState(null);
    const [imagePreview, setImagePreview] = useState(dataToEdit?.image || null);    //ดึงภาพจาก database

    const [ingredientScreen, setIngredientScreen] = useState(false);    //show: AddIngredient.jsx

    const [currentSize, setCurrentSize] = useState(null);
    const [price, setPrice] = useState(null);
    const [ingredientMain, setIngredientMain] = useState([
        {
            newIngredient: '',
            newIngredientQty: '',
            unit: 'kg'
        },
    ]);

    const [ingredientsBySize, setIngredientsBySize] = useState({});

    const [customOptions, setCustomOptions] = useState([]);
    const [newLabel, setNewLabel] = useState('');
    const [newOption, setNewOption] = useState('');
    const [isOptionVisible, setIsOptionVisible] = useState(false);

    const [ingredientOptions, setIngredientOptions] = useState([]);

    const [categoryList, setCategoryList] = useState([]);
    const [sizeList, setSizeList] = useState([]);

    // API: Fetch data from database (1.Food category 2.Food size 3.Ingredient)
    useEffect(() => {
        // Food category
        axios.get('http://localhost:5000/api/add_menus/category')
            .then(res => { setCategoryList(res.data); })
            .catch(err => console.error('Error fetching categories:', err));
        // Food size
        axios.get('http://localhost:5000/api/add_menus/size')
            .then(res => { setSizeList(res.data); })
            .catch(err => console.error('Error fetching sizes:', err));
        // Ingredient
        axios.get('http://localhost:5000/api/ingredients')
            .then(res => { setIngredientOptions(res.data); })
            .catch(err => console.error('Error fetching ingredients:', err));

        if (form == "Edit") {
            console.log('dataToEdit:');
            setMenuName(dataToEdit.name)
            setCategory_id(dataToEdit.category_id)
            setCategory(dataToEdit.category)
            setImagePreview(dataToEdit.image);
            setSizePrices(dataToEdit.sizePrices)
            setCustomOptions(dataToEdit.customOptions)
        }

    }, []);

    // Handle image upload
    const handleImageUpload = async () => {
        const { value: url } = await MySwal.fire({
            title: "ใส่ URL รูปภาพ",
            input: "url",
            inputPlaceholder: "https://example.com/image.jpg",
            inputValue: imageUrl || "", // ถ้ามี imageUrl ให้ใช้เป็นค่าเริ่มต้น
            showCancelButton: true,
            confirmButtonText: "อัปโหลด",
            cancelButtonText: "ยกเลิก",
        });

        if (url) {
            setImageUrl(url);
        }
    };

    // Add size and price
    const handleAddSizePrice = () => {
        if (newSize && newSizePrice) {
            setSizePrices([{
                size: newSize,
                price: Number(newSizePrice)
            },
            ...sizePrices
            ]);
            setNewSize('');
            setNewSizePrice('');
        }
    };

    // Show ingredient screen
    const handleIngredientScreen = (size, price, ingredient) => {
        setCurrentSize(size);
        setPrice(price)
        setIngredientMain(ingredient);

        console.log('ingredient:', ingredient);
        setIngredientScreen(true);
    };

    // Add ingredient
    const handleAddIngredient = (value) => {
        console.log('value:', value);
        const intoSizePrices = sizePrices.map((item) => {
            if (item.size === value.sizeName) {
                return { ...item, ingredients: value.ingredients };
            }
            return item;
        });

        console.log('intoSizePrices:', intoSizePrices);

        setSizePrices(intoSizePrices);
    };

    // Add custom option
    const handleAddOption = () => {
        if (newLabel && newOption) {
            setCustomOptions([
                ...customOptions,
                { label: newLabel, options: newOption.split(',').map((opt) => opt.trim()) },
            ]);
            setNewLabel('');
            setNewOption('');
            setIsOptionVisible(false);
        }
    };

    // Special Option 1.Edit 2.Delete
    const handleEditOption = (index) => {
        Swal.fire({
            title: "แก้ไขตัวเลือกพิเศษ",
            html: `
                <label for="swal-input-label">ชื่อหมวดหมู่:</label>
                <input id="swal-input-label" class="swal2-input" value="${customOptions[index].label}" placeholder="เช่น ระดับความหวาน" />
                <label for="swal-input-options">ตัวเลือก:</label>
                <input id="swal-input-options" class="swal2-input" value="${customOptions[index].options.join(', ')}" placeholder="เช่น 0, 25, 50 (กรุณาระบุเครื่องหมาย , ด้วย)" />
            `,
            showCancelButton: true,
            confirmButtonText: 'บันทึก',
            cancelButtonText: 'ยกเลิก',
        }).then((result) => {
            if (result.isConfirmed) {
                const editedLabel = document.getElementById('swal-input-label').value;
                const editedOptions = document.getElementById('swal-input-options').value;

                if (editedLabel && editedOptions) {
                    const updatedOptions = customOptions.map((item, i) =>
                        i === index
                            ? { ...item, label: editedLabel, options: editedOptions.split(',').map(opt => opt.trim()) }
                            : item
                    );
                    setCustomOptions(updatedOptions);
                } else {
                    Swal.fire("กรุณาระบุ ชื่อหมวดหมู่ และ ตัวเลือก ให้เรียบร้อย!", '', 'error');
                }
            }
        });
    };

    const handleDeleteOption = (index) => {
        const filteredOptions = customOptions.filter((_, i) => i !== index);
        setCustomOptions(filteredOptions);
    };

    const handleSave = () => {
        if (form == "Edit") {
            console.log(imagePreview)
            const editedMenu = {
                name: menuName,
                category_id,
                category: categoryList.find((item) => item._id === category_id)?.name,
                image: imageUrl,
                sizePrices,
                customOptions,
            };
            axios.put(`http://localhost:5000/api/foods/${dataToEdit._id}`, editedMenu)
            setShowItemDetail(false);
        } else {
            const newMenu = {
                name: menuName,
                category_id,
                category: categoryList.find((item) => item._id === category_id)?.name,
                image: imageUrl,
                sizePrices,
                customOptions,
            };
            axios.post('http://localhost:5000/api/foods', newMenu)
            setShowItemDetail(false);
        }
    };

    return (
        <>
            {!ingredientScreen ? (
                <Stack sx={{ minHeight: "100%", display: "flex" }} onSubmit={(e) => e.preventDefault()}>
                    {/* Header */}
                    <Grid sx={{ borderBottom: "1px solid #ddd", marginBottom: "8px", paddingBottom: "8px" }}>
                        <p style={{ fontSize: 18, fontWeight: 500, justifyContent: "center" }}>{form === "Edit" ? "แก้ไขเมนู" : "เพิ่มเมนูใหม่"}</p>
                    </Grid>

                    {/* Content */}
                    <Grid sx={{ flexGrow: 1 }}>
                        {/* 1. Food Name */}
                        <Grid mb={1}>
                            <label>ชื่อเมนู</label>
                            <input
                                type="text"
                                placeholder="เช่น ผัดกระเพรา"
                                value={menuName}
                                onChange={(e) => setMenuName(e.target.value)}
                            />
                        </Grid>
                        {/* 2. Food Category */}
                        <Grid mb={1} >
                            <label>หมวดหมู่</label>
                            <select className="form-select" value={category_id} onChange={(e) => setCategory_id(e.target.value)}>
                                {categoryList.map((item, index) => (
                                    <option key={index} value={item._id}>{item.name}</option>
                                ))}
                            </select>
                        </Grid>
                        {/* 3. Image url upload */}
                        <Grid direction="column" className="upload-img" style={{ marginTop: "10px", marginBottom: "10px", cursor: "pointer" }} onClick={handleImageUpload}>
                            {imageUrl ? (
                                <img src={imageUrl} alt="Uploaded" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <>
                                    <AddCircleIcon />
                                    <p>อัปโหลดรูปภาพ</p>
                                </>
                            )}
                        </Grid>

                        <Grid>
                            <label>ขนาดและราคา</label>
                            <Grid container marginBottom={"10px"}>
                                {sizePrices.map((item, index) => (
                                    <Grid item xs="auto" key={index}>
                                        <div className="option-box" onClick={() => handleIngredientScreen(item.size, item.price, item.ingredients)}>
                                            {item.size} : {item.price} บาท
                                        </div>
                                    </Grid>
                                ))}
                            </Grid>


                            <Grid container spacing={1} alignItems="center" paddingBottom="8px" marginBottom="8px" borderBottom="1px solid #ddd">
                                <Grid item xs={7} lg={4}>
                                    <select
                                        className="form-select"
                                        value={newSize}
                                        onChange={(e) => setNewSize(e.target.value)}
                                    >
                                        {sizeList.map((item, index) => (
                                            <option key={index} value={item.name}>{item.name}</option>
                                        ))}
                                    </select>
                                </Grid>

                                <Grid item xs={5} lg={3}>
                                    <input
                                        type="text"
                                        placeholder="ราคา"
                                        value={newSizePrice}
                                        onChange={(e) => setNewSizePrice(e.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={12} lg={5} display="flex" justifyContent="center">
                                    <button type="button" className="blue-button" onClick={handleAddSizePrice}>
                                        เพิ่มขนาดและราคา
                                    </button>
                                </Grid>
                            </Grid>


                        </Grid>

                        {/* Custom Options */}
                        <div className="right-box-header">
                            <div>
                                {customOptions.map((item, index) => (
                                    <div key={index} className="option-box">
                                        {item.label} : {item.options.join(', ')}
                                        <HiOutlinePencil
                                            onClick={() => handleEditOption(index)}
                                            className="icon"
                                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                                        />
                                        <HiOutlineTrash
                                            onClick={() => handleDeleteOption(index)}
                                            className="icon"
                                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="add-option-label">
                                <label style={{ marginTop: '8px', marginRight: '6px' }}>ตัวเลือกพิเศษ</label>
                                <AddCircleIcon
                                    type="button"
                                    className="circle-plus-btn"
                                    onClick={() => setIsOptionVisible(!isOptionVisible)}
                                />
                            </div>

                            {isOptionVisible && (
                                <div className="add-option-container">
                                    <input
                                        type="text"
                                        placeholder="ชื่อหมวดหมู่ เช่น ระดับความหวาน"
                                        value={newLabel}
                                        onChange={(e) => setNewLabel(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="ตัวเลือก เช่น 0, 25, 50"
                                        value={newOption}
                                        onChange={(e) => setNewOption(e.target.value)}
                                    />
                                    <button type="button" className="blue-button" onClick={handleAddOption}>
                                        เพิ่มตัวเลือก
                                    </button>
                                </div>
                            )}
                        </div>
                    </Grid>
                    <Grid display="flex" justifyContent="space-between" borderTop="1px solid #ddd" sx={{ marginTop: "auto", paddingTop: "8px" }}>
                        <button type="button" className="red-button" onClick={onCancel}>
                            ยกเลิก
                        </button>
                        <button type="button" className="blue-button" onClick={handleSave}>
                            บันทึก
                        </button>
                    </Grid>
                </Stack>
            ) : (
                <AddIngredient
                    currentSize={currentSize}
                    newSizePrice={price}
                    ingredientMain={ingredientMain}
                    ingredientsBySize={ingredientsBySize}
                    ingredientOptions={ingredientOptions}
                    handleAddIngredient={handleAddIngredient}
                    onAddIngredient={(size, ingredient) => {
                        const newIngredients = ingredientsBySize[size] || [];
                        setIngredientsBySize({
                            ...ingredientsBySize,
                            [size]: [...newIngredients, ingredient],
                        });
                    }}
                    onBack={() => setIngredientScreen(false)}
                />
            )}
        </>
    );
};

export default AddNewMenu;
