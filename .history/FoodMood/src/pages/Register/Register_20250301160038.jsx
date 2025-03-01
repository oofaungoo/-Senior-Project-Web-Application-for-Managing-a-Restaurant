import React from "react";
import { Button, Grid, TextField } from "@mui/material";

const Register = ({ user, onClose, onSave, isEditing }) => {
    return (
        <Grid>
            <p>เพิ่มแอดมินลงกฟะฟิฟหำ</p>
            <TextField required id="filled-required" label="username" variant="filled" />
            <TextField required id="filled-required" label="password" variant="filled" />
            <Button variant="contained"></Button>
        </Grid>
    )
};

export default Register;
