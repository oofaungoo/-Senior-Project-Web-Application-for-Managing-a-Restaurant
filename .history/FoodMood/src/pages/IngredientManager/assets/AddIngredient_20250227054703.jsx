import React, { useState, useEffect } from 'react';
import { Grid, Alert } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

const AddIngredient = ({ data, onClose, onSave, isEditing }) => {
    const [changedRemain, setChangedRemain] = useState(0);

    // Function: Input handle change
    const handleChange = (e) => {
        const { id, value } = e.target;
        setEditedData((prev) => ({ ...prev, [id]: value }));
    };

    // Function: Show information for user
    const [showInfo, setShowInfo] = useState(false);
    const toggleInfo = () => {
        setShowInfo(!showInfo);
    };

    // Default data (use for add new data)
    const [editedData, setEditedData] = useState({
        name: '',
        group: '',
        min: null,
        remain: null,
        unit: 'kg',
    });

    // API: Fetch "data" form database (Data already exist in database)
    useEffect(() => {
        setEditedData({
            name: data.name,
            group: data.group,
            unit: 'kg',
            remain: data.remain,
            min: data.min,
        });
    }, [data]);

    // Function: Save edited data (Data already exist in database)
    const handleSave = () => {
        const updatedData = {
            ...editedData,
            remain: (editedData.remain || 0) + changedRemain, // ✅ ทำให้มั่นใจ่วา remain ได้อัปเดทจริงๆ
        };
        onSave(updatedData);
    };

    return (
        <>  
            {/* Header */}
            <Grid sx={{ borderBottom: "1px solid #ddd", marginBottom: "8px", paddingBottom: "8px" }}>
                <p style={{ fontSize: 18, fontWeight: 500, justifyContent: "center" }}>{isEditing ? "แก้ไขวัตถุดิบ" : "เพิ่มวัตถุดิบใหม่"}</p>
            </Grid>

            <Grid container sx={{ display: "flex", alignItems: "center", marginBottom: "8px", }}>
                <label>ชื่อวัตถุดิบ</label>
                <input id="name" type="text" value={editedData.name || ''} onChange={handleChange} placeholder="ชื่อวัตถุดิบ เช่น น่องไก่ สะโพกไก่" />
            </Grid>

            <Grid container sx={{ display: "flex", alignItems: "center", marginBottom: "8px", }}>
                <label>หมวดหมู่</label>
                <select id="group" value={editedData.group || ''} onChange={handleChange}>
                    <option value="">-- เลือกหมวดหมู่ --</option>
                    <option value="เนื้อสัตว์">เนื้อสัตว์</option>
                    <option value="ผัก">ผัก</option>
                    <option value="ทะเล">ทะเล</option>
                    <option value="เครื่องดื่ม">เครื่องดื่ม</option>
                    <option value="ผลไม้">ผลไม้</option>
                </select>
            </Grid>

            <Grid container sx={{ display: "flex", alignItems: "center", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #ddd" }}>
                <label>หน่วยวัตถุดิบ</label>
                <select id="unit" value={editedData.unit} onChange={handleChange}>
                    <option value="kg">กิโลกรัม</option>
                    <option value="g">กรัม</option>
                </select>
            </Grid>

            <Grid container sx={{ display: "flex", alignItems: "center", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #ddd" }}>
                <label>จำนวนวัตถุดิบขั้นต่ำ</label>
                <Grid container alignItems="center">
                    <Grid item xs={10}>
                        <input type="number" id="min" value={editedData.min || ''} onChange={handleChange} placeholder="จำนวนขั้นต่ำ" />
                    </Grid>
                    <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <InfoIcon onClick={toggleInfo} style={{ color: "#64A2FF" }} />
                    </Grid>
                </Grid>
                {showInfo && (
                    <div className='fs-14' >
                        หากวัตถุดิบ <span className="text-red">"จำนวนคงเหลือ"</span> ในระบบน้อยกว่า <span className="text-red">"จำนวนขั้นต่ำ"</span> ระบบจะทำการแจ้งเตือนผู้ใช้ให้ทราบ
                    </div>
                )}
            </Grid>

            <Grid container direction="column" alignItems="center" sx={{ marginBottom: "16px", padding: "12px", background: "#f8f9fa", borderRadius: "8px", textAlign: "center" }}>
                <p style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "4px" }}>จำนวนวัตถุดิบคงเหลือปัจจุบัน:</p>
                <p style={{ fontSize: "20px", fontWeight: "bold", color: "#ff4b4b" }}>
                    {editedData.remain || 0}
                    <span style={{ color: "#64A2FF", marginLeft: "3px", marginRight: "3px" }}>
                        {changedRemain ? (changedRemain < 0 ? " - " : " + ") + Math.abs(changedRemain) : ""}
                    </span>
                    {editedData.unit}
                </p>
            </Grid>

            <Grid container sx={{ display: "flex", flexDirection: "column", marginBottom: "8px" }}>
                <label>ระบุจำนวนวัตถุดิบที่ต้องการเพิ่ม/ลด</label>
                <input
                    type="number"
                    id="changedRemain"
                    value={changedRemain || ''}
                    onChange={(e) => setChangedRemain(Number(e.target.value) || 0)}
                    placeholder="จำนวนคงเหลือ"
                    required
                    style={{ padding: "8px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ccc", width: "100%" }}
                />
            </Grid>

            {/* Action Buttons */}
            <Grid display="flex" justifyContent="space-between" borderTop="1px solid #ddd" sx={{ marginTop: "auto", paddingTop: "8px" }}>
                <button className="red-button" onClick={onClose}>ยกเลิก</button>
                <button className="blue-button" onClick={() => handleSave(editedData)}>บันทึก</button>
            </Grid>

        </>
    );
};

export default AddIngredient;
