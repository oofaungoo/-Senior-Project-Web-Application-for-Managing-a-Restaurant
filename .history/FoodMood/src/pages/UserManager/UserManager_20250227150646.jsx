import React, { useState, useEffect } from 'react';
import './UserManager.css';
import '../IngredientManager/IngredientManager.css';
import EditUser from './assets/EditUser';
import UserTable from './assets/UserTable';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Box, useMediaQuery, Modal } from "@mui/material";

{/* Bug check
    1. แก้ตาราง
    2. สำหรับ user ประเภท "admin/เจ้าของร้าน" จะไม่สามารถแก้ไขข้อมูลได้ ดูได้อย่างเดียว เพื่อป้องกันคนเข้ามาแก้ข้อมูล
*/}

const UserManager = () => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1040px)");

    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showEditUser, setShowEditUser] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roleOptions, setRoleOptions] = useState([]);
    const [userToDelete, setUserToDelete] = useState(null);

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users');
                setData(response.data);

            } catch (err) {
                console.error('Failed to fetch users:', err);
                setError('Failed to load user data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        axios.get('http://localhost:5000/api/roles')
            .then(res => {
                console.log('role จ้า: ', res.data);
                setRoleOptions(res.data);

            })
            .catch(err => console.error('Error fetching :', err));

    }, []);

    const filteredData = data.filter(item =>
        (item.id && item.id.includes(searchQuery)) || (item.name && item.name.includes(searchQuery))
    );

    const handleEditUser = (user) => {
        setUserToEdit(user);
        setIsEditing(true); // Edit user mode
        setShowEditUser(true);
    };

    const handleAddNewUser = () => {
        setUserToEdit({ id: '', name: '', nickname: '', roll: '', status: 'offline', phone: '' });
        setIsEditing(false); // Add new user mode
        setShowEditUser(true);
    };

    const handleSaveUser = (updatedUser) => {
        if (isEditing) {
            axios.put(`http://localhost:5000/api/users/${userToEdit._id}`, updatedUser)
                .then(res => {
                    console.log('User updated กหหหหหหหหหหหหหหหห:', res.data);
                    setData(data.map(user => (user._id === res.data._id ? res.data : user)));
                })
                .catch(err => console.error('Failed to update user:', err));
        } else {
            console.log('เพิ่ม user:', updatedUser);
            axios.post('http://localhost:5000/api/users', updatedUser)
                .then(res => {
                    console.log('User added:', res.data);
                    setData([...data, res.data]);
                })
                .catch(err => console.error('Failed to add user:', err));
        }
        setShowEditUser(false);
    };

    const handleDeleteUser = (user) => {
        axios.delete(`http://localhost:5000/api/users/${user._id}`)
            .then((res) => {
                Swal.fire({
                    title: 'ผู้ใช้ดังกล่าวถูกลบแล้ว!',
                    icon: 'success',
                    confirmButtonColor: "#64A2FF",
                    confirmButtonText: 'OK',
                });
                setData((prevData) => prevData.filter((item) => item._id !== user._id));
            })
            .catch((err) => {
                Swal.fire({
                    title: 'เกิดข้อผิดพลาดในการลบผู้ใช้ดังกล่าว',
                    text: 'ลองใหม่อีกครั้ง',
                    icon: 'error',
                    confirmButtonColor: "#64A2FF",
                    confirmButtonText: 'OK',
                });
            });
    };

    const handleClickConfirm = (e) => {
        setUserToDelete(e);
        Swal.fire({
            title: 'แน่ใจใช่ไหม?',
            text: `คุณกำลังจะลบผู้ใช้\nชื่อ: ${e.name}\nตำแหน่ง: ${roleOptions.find(role => role._id === e.role_id)?.role_name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#ff4b4b",
            cancelButtonColor: "#B2B2B2",
            confirmButtonText: 'ยืนยันการลบ',
            cancelButtonText: 'ยกเลิก',
            dangerMode: true,
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteUser(e);
            } else {
                Swal.fire({
                    title: 'ยกเลิกการลบ',
                    confirmButtonColor: '#64A2FF',
                });
            }
        });
    };


    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <>
            <Box
                sx={{ backgroundColor: "#fff", width: isMobile ? "100%" : isTablet ? "65%" : "75%", height: "100vh", padding: "20px", borderRadius: "8px", overflowY: "auto", marginRight: "10px" }}
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
                <UserTable data={filteredData} roleOptions={roleOptions} onEdit={handleEditUser} handleClickConfirm={handleClickConfirm} />
            </Box>

            {!isMobile && selectedData && (
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

            {/* แสดงเป็น Modal สำหรับ Mobile */}
            {isMobile && (
                <Modal open={!!selectedData} onClose={() => setSelectedData(null)}>
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
                        {showEditUser && (
                            <EditUser
                                isEditing={isEditing}
                                user={userToEdit}
                                onClose={() => setShowEditUser(false)}
                                onSave={handleSaveUser}
                            />
                        )}
                    </Box>
                </Modal>
            )}



        </>
    );
};

export default UserManager;
