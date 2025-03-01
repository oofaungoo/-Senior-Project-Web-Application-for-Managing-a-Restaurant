import React from "react";
import { Grid, TextField } from "@mui/material";

const Register = ({ user, onClose, onSave, isEditing }) => {
    return (
        <Grid>
            <TextField required id="filled-required" label="username" variant="filled" />
            <TextField required id="filled-required" label="password" variant="filled" />
        </Grid>
    )
};

export default Register;
