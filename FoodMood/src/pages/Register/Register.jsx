import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { TextField, Button, InputAdornment, IconButton, Stack } from "@mui/material";
import Swal from 'sweetalert2';
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSave = async () => {
        if (!name || !phoneNumber || !username || !password) {
            Swal.fire("Error", "กรุณากรอกข้อมูลให้ครบถ้วน", "error");
            return;
        }
    
        if (password.length < 6) {
            Swal.fire("Error", "Password ต้องมีอย่างน้อย 6 ตัวอักษร", "error");
            return;
        }
    
        const newUser = { username, name, phone_number: phoneNumber, password };
    
        try {
            const res = await axios.post('http://localhost:5000/api/users/register', newUser);
            Swal.fire("สำเร็จ", res.data.message, "success");
            navigate('/');
        } catch (err) {
            Swal.fire("Error", err.response?.data?.error || "เกิดข้อผิดพลาด", "error");
        }
    };    

    return (
        <Stack spacing={2} sx={{ width: "100%", maxWidth: 400, mx: "auto", mt: 3 }}>
            <TextField
                required
                label="Username"
                variant="filled"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                required
                label="ชื่อพนักงาน"
                variant="filled"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                required
                label="เบอร์โทรศัพท์"
                variant="filled"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <TextField
                required
                label="Password"
                variant="filled"
                type={showPassword ? "text" : "password"} // 🔹 เปลี่ยน type ตาม state
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
            <Button variant="contained" onClick={handleSave}>Register</Button>
        </Stack>
    );
};

export default Register;
