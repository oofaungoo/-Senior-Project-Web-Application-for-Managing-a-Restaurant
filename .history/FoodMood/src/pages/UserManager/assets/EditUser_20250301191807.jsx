import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { TextField, IconButton, InputAdornment, Grid, MenuItem } from "@mui/material";
import Swal from 'sweetalert2';

const EditUser = ({ user, onClose, onSave, isEditing }) => {
    const [editedUser, setEditedUser] = useState({
        name: '',
        username: '',
        password: '',
        role_id: '',
        phone_number: '',
    });
    const [selectPosition, setSelectPosition] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setEditedUser({
            name: user.name || '',
            username: isEditing
                ? user.username // ถ้าเป็นการแก้ไข ให้ใช้ username เดิมที่เคยกรอก
                : user.role === '1'
                    ? user.username
                    : 'employee', // ถ้าเป็นการเพิ่มใหม่ และไม่ใช่เจ้าของร้าน ให้ default เป็น "employee"
            password: user.password || '',
            role_id: user.role_id || '',
            phone_number: user.phone_number || '',
        });
        setSelectPosition(user.role_id || '');
    }, [user, isEditing]);

    const [roleList, setRoleList] = useState([]);

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
        
        setEditedUser(prevUser => ({
            ...prevUser,
            role_id: value,
            username: value === "1" ? prevUser.username : "employee",
        }));
    };

    const handleSave = async () => {
        if (!editedUser.name || !selectPosition || !editedUser.password || !editedUser.phone_number) {
            Swal.fire({
                icon: "warning",
                title: "กรุณากรอกข้อมูลให้ครบถ้วน!",
                confirmButtonText: "ตกลง"
            });
            return;
        }
    
        if (selectPosition === 'เจ้าของร้าน' && !editedUser.username) {
            Swal.fire({
                icon: "warning",
                title: "กรุณากรอก Username!",
                confirmButtonText: "ตกลง"
            });
            return;
        }
    
        const updatedUser = { ...editedUser, role_id: selectPosition };
    
        try {
            await onSave(updatedUser);
    
            Swal.fire({
                icon: "success",
                title: "บันทึกข้อมูลสำเร็จ!",
                showConfirmButton: false,
                timer: 1500
            });
    
            onClose();
        } catch (error) {
            console.error("Error:", error);
            let errorMessage = "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
    
            if (error.response) {
                const { data } = error.response;
                if (data.error) {
                    errorMessage = data.error; // ใช้ข้อความจาก Backend
                }
            }
    
            Swal.fire({
                icon: "error",
                title: errorMessage,
                confirmButtonText: "ตกลง"
            });
        }
    };
    

    return (
        <>
            <Grid sx={{ borderBottom: "1px solid #ddd", marginBottom: "8px", paddingBottom: "8px" }}>
                <p style={{ fontSize: 18, fontWeight: 500, textAlign: "center" }}>
                    {isEditing ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้ใหม่'}
                </p>
            </Grid>

            <TextField
                fullWidth
                label="ชื่อพนักงาน"
                variant="outlined"
                name="name"
                value={editedUser.name || ''}
                onChange={handleChange}
                margin="normal"
            />

            <TextField
                fullWidth
                select
                label="ตำแหน่ง (Role)"
                variant="outlined"
                name="role"
                value={selectPosition}
                onChange={handleRoleChange}
                margin="normal"
                required
            >
                <MenuItem value="" disabled>-- เลือกตำแหน่ง --</MenuItem>
                {roleList.map((item, index) => (
                    <MenuItem key={index} value={item._id}>{item.role_name}</MenuItem>
                ))}
            </TextField>

            <TextField
                fullWidth
                label="Username"
                variant="outlined"
                name="username"
                value={editedUser.username}
                onChange={handleChange}
                margin="normal"
                disabled={selectPosition !== "1"} // ปลดล็อกเฉพาะเจ้าของร้าน
            />

            <TextField
                fullWidth
                label={selectPosition === "เจ้าของร้าน" ? "Password" : "รหัส PIN 6 หลัก"}
                type={showPassword ? "text" : "password"}
                variant="outlined"
                name="password"
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

            <TextField
                fullWidth
                label="เบอร์โทรศัพท์"
                variant="outlined"
                name="phone_number"
                placeholder='เช่น 0812345678'
                value={editedUser.phone_number || ''}
                onChange={handleChange}
                margin="normal"
                inputProps={{ maxLength: 10, minLength: 10 }}
                required
            />

            <Grid display="flex" justifyContent="space-between" borderTop="1px solid #ddd" sx={{ marginTop: "auto", paddingTop: "8px" }}>
                <button className="red-button" onClick={onClose}>ปิด</button>
                <button className="blue-button" onClick={handleSave}>บันทึก</button>
            </Grid>
        </>
    );
};

export default EditUser;
