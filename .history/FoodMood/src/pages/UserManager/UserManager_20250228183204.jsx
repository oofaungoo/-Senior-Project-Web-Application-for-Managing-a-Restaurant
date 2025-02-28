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
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users');
                setData(response.data);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            }
        };
        fetchData();

        axios.get('http://localhost:5000/api/roles')
            .then(res => setRoleOptions(res.data))
            .catch(err => console.error('Error fetching roles:', err));
    }, []);

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
                .then(res => setData(data.map(user => (user._id === res.data._id ? res.data : user))))
                .catch(err => console.error('Failed to update user:', err));
        } else {
            axios.post('http://localhost:5000/api/users', updatedUser)
                .then(res => setData([...data, res.data]))
                .catch(err => console.error('Failed to add user:', err));
        }
        setShowEditUser(false);
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
                <UserTable data={filteredData} roleOptions={roleOptions} onEdit={handleEditUser} />

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
