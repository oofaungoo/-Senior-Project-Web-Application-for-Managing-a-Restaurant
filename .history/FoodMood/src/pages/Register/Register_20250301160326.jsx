import React, { useEffect } from "react";
import { Button, Grid, TextField } from "@mui/material";
import Swal from 'sweetalert2';

const handleSave = () => {

};

const Register = ({ user, onClose, onSave, isEditing }) => {
    return (
        <Box>
            <p>เพิ่มแอดมินลง Database</p>
            <TextField required id="filled-required" label="username" variant="filled" />
            <TextField required id="filled-required" label="password" variant="filled" maxlength={6} />
            <Button variant="contained">Register</Button>
        </Box>
    )
};

export default Register;
