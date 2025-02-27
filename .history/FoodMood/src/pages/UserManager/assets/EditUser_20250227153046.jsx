import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { TextField, IconButton, InputAdornment, Grid } from "@mui/material";

const EditUser = ({ user, onClose, onSave, isEditing }) => {
    const [editedUser, setEditedUser] = useState({
        name: '',
        username: '',
        password: '',
        role_id: '',
        phone_number: '',
    });
    const [selectPosition, setSelectPosition] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

    useEffect(() => {
        setEditedUser({
            name: user.name,
            username: user.role === 'เจ้าของร้าน' ? user.username : 'employee',
            password: user.password,
            role_id: user.role_id,
            phone_number: user.phone_number,
        });
        handleRoleChange({ target: { value: user.role_id } });
    }, [user]);

    const [roleList, setRoleList] = useState([]);

    // Fetch roles from API
    useEffect(() => {
        axios.get('http://localhost:5000/api/roles')
            .then(res => setRoleList(res.data))
            .catch(err => console.error('Failed to fetch roles:', err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const handleRoleChange = (e) => {
        const { value } = e.target;
        setSelectPosition(value);
    };

    const handleSave = () => {
        if (!editedUser.name) return;
        if (!selectPosition) return;
        if (selectPosition === 'เจ้าของร้าน' && !editedUser.username) return;
        if (!editedUser.password) return;
        if (!editedUser.phone_number) return;

        const updatedUser = { ...editedUser, role_id: selectPosition };
        onSave(updatedUser);
    };

    return (
        <>  
            <Grid sx={{ borderBottom: "1px solid #ddd", marginBottom: "8px", paddingBottom: "8px" }}>
                <p style={{ fontSize: 18, fontWeight: 500, justifyContent: "center" }}>{isEditing ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้ใหม่'}</p>
            </Grid>

            <TextField
                fullWidth
                label="ชื่อพนักงาน"
                variant="outlined"
                value={editedUser.name || ''}
                onChange={handleChange}
                onChange={(e) =>
                    setEditedUser(prev => ({ ...prev, password: e.target.value }))
                }
            />

            <div style={{ height: '10px' }} />
            <label>ตำแหน่ง (Role)</label>
            <select
                className="form-select"
                name="role"
                value={selectPosition}
                onChange={handleRoleChange}
                required
            >
                <option value="" disabled>-- เลือกตำแหน่ง --</option>
                {roleList.map((item, index) => (
                    <option key={index} value={item._id}>{item.role_name}</option>
                ))}
            </select>

            <div style={{ height: '10px' }} />
            <label>Username</label>
            <input
                type='text'
                name="username"
                value={editedUser.username}
                onChange={handleChange}
                disabled={selectPosition !== "เจ้าของร้าน"} // ปลดล็อกเฉพาะเจ้าของร้าน
            />

            <div style={{ height: '10px' }} />
            <TextField
                fullWidth
                label={selectPosition === "เจ้าของร้าน" ? "Password" : "รหัส PIN 6 หลัก"}
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={editedUser.password || ""}
                onChange={handleChange}
                margin="normal"
                inputProps={{
                    minLength: 6,
                    maxLength: selectPosition !== "เจ้าของร้าน" ? 6 : undefined, // PIN จำกัด 6 ตัว
                }}
                InputProps={{
                    sx: { fontFamily: "inherit" },
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <div style={{ height: '10px' }} />
            <label>เบอร์โทรศัพท์</label>
            <input
                type="text"
                name="phone_number"
                placeholder='เช่น 0812345678'
                maxLength="10"
                value={editedUser.phone_number || ''}
                onChange={handleChange}
                minLength={10}
                maxLength={10}
                required
            />

            <div className="order-action-buttons">
                <button className="blue-button" onClick={handleSave}>บันทึก</button>
                <button className="red-button" onClick={onClose}>ยกเลิก</button>
            </div>
        </>
    );
};

export default EditUser;
