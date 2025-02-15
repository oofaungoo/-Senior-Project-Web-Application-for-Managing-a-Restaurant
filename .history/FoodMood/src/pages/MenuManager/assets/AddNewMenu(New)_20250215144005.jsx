import React, { useState, useEffect } from 'react';
import { HiPlusCircle } from "react-icons/hi";
import './AddNewMenu.css';
import AddIngredient from './AddIngredient';
import axios from 'axios';

{/* 
    1. กดแก้ไขแล้วมันไม่ดึงข้อมูลไปแก้
*/}

const AddNewMenu = ({ data, isEditing, onSave, onClose }) => {
    const [menuName, setMenuName] = useState('');
    const [category_id, setCategory_id] = useState('1');
    const [category, setCategory] = useState('1');
    const [sizePrices, setSizePrices] = useState([]);
    const [newSize, setNewSize] = useState('ปกติ');
    const [newSizePrice, setNewSizePrice] = useState('');
    const [imagePreview, setImagePreview] = useState(null);             //show: user input image (ตอนนีัสามารถ show ได้ แต่ยังไม่สามารถเก็บใน database ได้)

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
        console.log('newSizePrice', newSizePrice);

        axios.get('http://localhost:5000/api/add_menus/category')
            .then(res => {
                //console.log('category จ้า: ', res.data);
                setCategoryList(res.data); // อัปเดต categoryList
            })
            .catch(err => console.error('Error fetching categories:', err));

        axios.get('http://localhost:5000/api/add_menus/size')
            .then(res => {
                //console.log('size จ้า: ', res.data);
                setSizeList(res.data); // อัปเดต sizeList
            })
            .catch(err => console.error('Error fetching sizes:', err));

        axios.get('http://localhost:5000/api/ingredients')
            .then(res => {
                //console.log('ingredient จ้า: ', res.data);
                setIngredientOptions(res.data); // อัปเดต ingredientOptions
            })
            .catch(err => console.error('Error fetching ingredients:', err));
    }, []);

    // Handle image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
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

    // Default data (use for add new data)
    const [editedData, setEditedData] = useState({
        name: '',
        category_id: null,
        category: null,
        image: null,
        sizePrices: null,
        customOptions: null
    });

    // API: Fetch "data" form database (Data already exist in database)
    useEffect(() => {
        setEditedData({
            name: data.name,
            category_id: data.category_id,
            category: categoryList.find((item) => item._id === category_id)?.name,
            image: imagePreview,
            sizePrices: data.sizePrice,
            customOptions: data.custonOptions
        });
    }, [data]);

    const handleSave = () => {
        onSave(editedData)
    };

    return (
        <div className="right-box">
            {!ingredientScreen ? (
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="right-box-header text-center fs-18 fw-5">เพิ่มเมนูใหม่</div>

                    <div style={{ marginTop: "10px" }}>
                        <label>ชื่อเมนู</label>
                        <input
                            type="text"
                            placeholder="เช่น ผัดกระเพรา"
                            value={editedData.name || ''}
                            onChange={(e) => setMenuName(e.target.value)}
                        />
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        <label>หมวดหมู่</label>
                        <select
                            className="form-select"
                            value={editedData.category_id || ''}
                            onChange={(e) => setCategory_id(e.target.value)}
                        >
                            {categoryList.map((item, index) => (
                                <option key={index} value={item._id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="upload-img" style={{ marginTop: "10px" }} onClick={() => document.getElementById('fileInput').click()}>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <>
                                <HiPlusCircle className="fs-60" />
                                อัปโหลดรูปภาพ
                            </>
                        )}
                    </div>
                    <input
                        id="fileInput"
                        type="file"
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleImageUpload}
                    />

                    <div style={{ marginTop: "10px" }}>
                        <label>ขนาดและราคา</label>
                        <div>
                            {sizePrices.map((item, index) => (
                                <div
                                    key={index}
                                    className="option-box"
                                    onClick={() => handleIngredientScreen(item.size, item.price, item.ingredients)}
                                >
                                    {item.size} : {item.price} บาท
                                </div>
                            ))}
                        </div>

                        <div className="size-price-inputs" style={{ marginTop: "10px" }}>
                            <select
                                className="form-select"
                                value={newSize}
                                onChange={(e) => setNewSize(e.target.value)}
                            >
                                {sizeList.map((item, index) => (
                                    <option key={index} value={item.name}>{item.name}</option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="ราคา"
                                value={newSizePrice}
                                onChange={(e) => setNewSizePrice(e.target.value)}
                            />
                        </div>
                        <button type="button" className="blue-button text-center" style={{ marginTop: "10px" }} onClick={handleAddSizePrice}>
                            เพิ่มขนาดและราคา
                        </button>
                    </div>

                    <div className='right-box-header' />

                    {/* Custom Options */}
                    <div className="right-box-header">
                        <div>
                            {customOptions.map((item, index) => (
                                <div key={index} className="option-box">
                                    {item.label} : {item.options.join(', ')}
                                </div>
                            ))}
                        </div>
                        <div className="add-option-label">
                            <label style={{ marginTop: '8px', marginRight: '6px' }}>ตัวเลือกพิเศษ</label>
                            <button
                                type="button"
                                className="circle-plus-btn"
                                onClick={() => setIsOptionVisible(!isOptionVisible)}
                            >
                                +
                            </button>
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
                    <div className="order-action-buttons">
                        <button type="button" className="blue-button" onClick={() => handleSave(editedData)}>
                            บันทึก
                        </button>
                        <button type="button" className="red-button" onClick={onClose}>
                            ยกเลิก
                        </button>
                    </div>
                </form>
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
        </div>
    );
};

export default AddNewMenu;
