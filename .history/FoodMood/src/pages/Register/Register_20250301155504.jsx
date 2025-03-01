import React from "react";
import { Grid, TextField } from "@mui/material";

const Register = ({ user, onClose, onSave, isEditing }) => {
    return (
        <Grid>
            <TextField
          disabled
          id="outlined-disabled"
          label="Disabled"
          defaultValue="Hello World"
        />
        </Grid>
    )
};

export default Register;
