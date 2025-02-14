import React, { useState, useEffect } from 'react';
import './UserManager.css';
import '../IngredientManager/IngredientManager.css';
import EditUser from './assets/EditUser';
import UserTable from './assets/UserTable';
import axios from 'axios';
import Swal from 'sweetalert2';

const UserManager = () => {
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
            console.log('แก้ไข user  :', userToEdit._id);
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
        <div className='container'>
            <div className="middle-box">
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="ค้นหาด้วยชื่อ จ้า รอบ 2 0.30 กหกหกหก"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="blue-button" onClick={handleAddNewUser}>เพิ่มผู้ใช้ใหม่</button>
                </div>
                <UserTable data={filteredData} roleOptions={roleOptions} onEdit={handleEditUser} handleClickConfirm={handleClickConfirm} />
            </div>
            {showEditUser && (
                <EditUser
                    isEditing={isEditing}
                    user={userToEdit}
                    onClose={() => setShowEditUser(false)}
                    onSave={handleSaveUser}
                />
            )}
            
        </div>
    );
};

export default UserManager;
