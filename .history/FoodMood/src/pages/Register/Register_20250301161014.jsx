import React, { useState } from "react";
import { TextField, Button, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Swal from 'sweetalert2';
import axios from "axios";

const Register = ({ onClose }) => {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);  // 🔹 State สำหรับเปิด/ปิด Password

    const handleSave = async () => {
        if (!name || !phoneNumber || !username || !password) {
            Swal.fire("Error", "กรุณากรอกข้อมูลให้ครบถ้วน", "error");
            return;
        }

        if (password.length < 6) {
            Swal.fire("Error", "Password ต้องมีอย่างน้อย 6 ตัวอักษร", "error");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/register", {
                name,
                phone_number: phoneNumber,
                username,
                password,
            });

            Swal.fire("สำเร็จ", res.data.message, "success");
            onClose();  // ปิด Modal หรือหน้า Register ถ้ามีการส่ง props นี้มา
        } catch (err) {
            Swal.fire("Error", err.response?.data?.error || "เกิดข้อผิดพลาด", "error");
        }
    };

    return (
        <>
            <p>เพิ่มแอดมินลง Database</p>
            <TextField
                required
                label="ชื่อ-นามสกุล"
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
                label="Username"
                variant="filled"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
        </>
    );
};

export default Register;
