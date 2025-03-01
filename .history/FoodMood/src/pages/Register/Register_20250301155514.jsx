import React from "react";
import { Grid, TextField } from "@mui/material";

const Register = ({ user, onClose, onSave, isEditing }) => {
    return (
        <Grid>
            <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
        />
        </Grid>
    )
};

export default Register;
