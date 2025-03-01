import React, { useEffect } from "react";
import axios from 'axios';
import { Button, Grid, TextField } from "@mui/material";
import Swal from 'sweetalert2';

useEffect(() => {
        
    }
);

const Register = ({ user, onClose, onSave, isEditing }) => {
    return (
        <Grid>
            <p>เพิ่มแอดมินลง Database</p>
            <TextField required id="filled-required" label="username" variant="filled" />
            <TextField required id="filled-required" label="password" variant="filled" maxlength={6} />
            <Button variant="contained">Register</Button>
        </Grid>
    )
};

export default Register;
