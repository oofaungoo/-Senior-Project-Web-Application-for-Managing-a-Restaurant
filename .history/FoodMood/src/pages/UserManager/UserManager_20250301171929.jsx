import React, { useState, useEffect } from 'react';
import './UserManager.css';
import '../IngredientManager/IngredientManager.css';
import EditUser from './assets/EditUser';
import UserTable from './assets/UserTable';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Box, useMediaQuery, Modal } from "@mui/material";

const UserManager = () => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1040px)");

    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showEditUser, setShowEditUser] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [roleOptions, setRoleOptions] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/users')
            .then(res => setData(res.data))
            .catch(err => console.error('Error fetching roles:', err));
        axios.get('http://localhost:5000/api/roles')
            .then(res => setRoleOptions(res.data))
            .catch(err => console.error('Error fetching roles:', err));
    }, [data]);

    const handleEditUser = (user) => {
        setUserToEdit(user);
        setIsEditing(true);
        setShowEditUser(true);
    };

    const handleAddNewUser = () => {
        setUserToEdit({ id: '', name: '', nickname: '', roll: '', phone: '' });
        setIsEditing(false);
        setShowEditUser(true);
        console.log("เปิด Modal:", showEditUser);
    };

    const handleSaveUser = (updatedUser) => {
        if (isEditing) {
            axios.put(`http://localhost:5000/api/users/${userToEdit._id}`, updatedUser)
                .then(res => {
                    console.log(res)
                    setData(data.map(user => (user._id === res.data._id ? res.data : user)))
                })
                .catch(err => console.error('Failed to update user:', err));
        } else {
            axios.post('http://localhost:5000/api/users', updatedUser)
                .then(res => setData([...data, res.data]))
                .catch(err => console.error('Failed to add user:', err));
        }
        setShowEditUser(false);
    };

    const handleDeleteUser = (user) => {
        Swal.fire({
            title: "คุณแน่ใจหรือไม่?",
            text: "เมื่อลบแล้วจะไม่สามารถกู้คืนได้!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff7878",
            cancelButtonColor: "#B2B2B2",
            confirmButtonText: "ใช่, ลบเลย!",
            cancelButtonText: "ยกเลิก"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:5000/api/users/${user._id}`)
                    .then(() => {
                        setData(data.filter(user => user._id !== user));
                        Swal.fire("ลบสำเร็จ!", "ผู้ใช้ถูกลบออกจากระบบ", "success");
                    })
                    .catch(err => {
                        console.error('Failed to delete user:', err);
                        Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบผู้ใช้ได้", "error");
                    });
            }
        });
    };
    

    const filteredData = data.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Box
                sx={{
                    backgroundColor: "#fff",
                    width: isMobile ? "100%" : isTablet ? "65%" : "75%",
                    height: "100vh",
                    padding: "20px",
                    borderRadius: "8px",
                    overflowY: "auto",
                    marginRight: "10px"
                }}
            >
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="ค้นหาด้วยชื่อ เช่น น้องแก้ม เฟื่อง"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="blue-button" onClick={handleAddNewUser}>เพิ่มผู้ใช้ใหม่</button>
                </div>
                <UserTable data={filteredData} roleOptions={roleOptions} onEdit={handleEditUser} onClick={handleDeleteUser}/>
            </Box>

            {!isMobile && showEditUser && (
                <Box
                    sx={{
                        backgroundColor: "#fff",
                        width: isTablet ? "35%" : "25%",
                        height: "100vh",
                        padding: "20px",
                        borderRadius: "8px",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <EditUser
                        isEditing={isEditing}
                        user={userToEdit}
                        onClose={() => setShowEditUser(false)}
                        onSave={handleSaveUser}
                    />
                </Box>
            )}

            {isMobile && (
                <Modal open={showEditUser} onClose={() => setShowEditUser(false)}>
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            padding: "15px",
                            borderRadius: "8px",
                            maxWidth: "90vw",
                            height: "80vh",
                            margin: "10vh auto",
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <EditUser
                            isEditing={isEditing}
                            user={userToEdit}
                            onClose={() => setShowEditUser(false)}
                            onSave={handleSaveUser}
                        />
                    </Box>
                </Modal>
            )}
        </>
    );
};

export default UserManager;
