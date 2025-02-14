import React, { useState, useEffect } from 'react';

const EditIngredient = ({ ingredient, onSave, onClose }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [unit, setUnit] = useState('');

    useEffect(() => {
        if (ingredient) {
            setName(ingredient.name);
            setCategory(ingredient.category);
            setQuantity(ingredient.cnt);
            setUnit(ingredient.unit);
        }
    }, [ingredient]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...ingredient,
            name,
            category,
            cnt: quantity,
            unit
        });
    };

    const handleQuantityIncrease = () => setQuantity(prev => prev + 1);
    const handleQuantityDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="right-box">
            <div className='fs-20 fw-5 right-box-header text-center'>แก้ไขวัตถุดิบ</div>
            <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
                <input
                    type="text"
                    placeholder="ชื่อวัตถุดิบ เช่น ปลานิล"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">ระบุหมวดหมู่</option>
                    <option value="เนื้อสัตว์">เนื้อสัตว์</option>
                    <option value="ผัก">ผัก</option>
                    <option value="ทะเล">ทะเล</option>
                    <option value="เครื่องดื่ม">เครื่องดื่ม</option>
                    <option value="ผลไม้">ผลไม้</option>
                </select>

                <div className='text-center' style={{ marginBottom: "10px" }}>
                    <div>จำนวน</div>
                    <div className="quantity-div">
                        <button onClick={handleQuantityDecrease} className="quantity-left-btn" type="button" disabled={quantity === 1}>
                            -
                        </button>
                        <span>{quantity}</span>
                        <button onClick={handleQuantityIncrease} className="quantity-right-btn" type="button">+</button>
                    </div>
                </div>


                <input
                    type="text"
                    placeholder="หน่วย เช่น กก. กิโลกรัม"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    required
                />
                <div className='order-action-buttons' style={{ marginTop: '10px' }}>
                    <div className="blue-button text-center" type="submit" >บันทึกการเปลี่ยนแปลง</div>
                    <button type="button" className="red-button" onClick={onClose}>ยกเลิก</button>
                </div>

            </form>
        </div>
    );
};

export default EditIngredient;
