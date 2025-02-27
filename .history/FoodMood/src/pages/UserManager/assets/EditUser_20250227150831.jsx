import axios from 'axios';
import React, { useState, useEffect } from 'react';

const EditUser = ({ user, onClose, onSave, isEditing }) => {

    const [editedUser, setEditedUser] = useState({
        name: '',
        username: '',
        password: '',
        role_id: '',
        phone_number: '',
    });
    const [selectPosition, setSelectPosition] = useState('');

    useEffect(() => {
        setEditedUser({
            name: user.name,
            username: user.role === 'เจ้าของร้าน' ? user.username : 'employee',
            password: user.password,
            role_id: user.role_id,
            phone_number: user.phone_number,
        });
        handleRoleChange({ target: { value: user.role_id } });
    }, [user]);

    const [roleList, setRoleList] = useState([]);

    //error state
    const [errorName, setErrorName] = useState(false);
    const [errorRole, setErrorRole] = useState(false);
    const [errorUsername, setErrorUsername] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);

    // Fetch roles from API
    useEffect(() => {
        axios.get('http://localhost:5000/api/roles')
            .then(res => {
                console.log('Roles in the system:', res.data);
                setRoleList(res.data);
            })
            .catch(err => console.error('Failed to fetch roles:', err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const handleRoleChange = (e) => {
        const { value } = e.target;
        setSelectPosition(value);
    };

    const handleSave = (e) => {

        if (!editedUser.name) { setErrorName(true); return; } setErrorName(false);
        if (!selectPosition) { setErrorRole(true); return; } setErrorRole(false);
        if (selectPosition === 'เจ้าของร้าน' && !editedUser.username) { setErrorUsername(true); return; } setErrorUsername(false);
        if (!editedUser.password) { setErrorPassword(true); return; } setErrorPassword(false);
        if (!editedUser.phone_number) { setErrorPhone(true); return; } setErrorPhone(false);


        const updatedUser = {
            ...editedUser,
            role_id: selectPosition
        };
        console.log('Updated user:', updatedUser);


        onSave(updatedUser);
    };

    return (
        <>
            <div className="fs-20 fw-5 text-center right-box-header" style={{ marginBottom: '10px' }}>
                {isEditing ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้ใหม่'}
            </div>

            <label>ชื่อพนักงาน</label>
            <input
                type="text"
                name="name"
                value={editedUser.name || ''}
                onChange={handleChange}
                required
            />
            {errorName && <div className='text-red'>กรุณากรอกชื่อ</div>}

            <div style={{ height: '10px' }} />
            <label>ตำแหน่ง (Role)</label>
            <select
                className="form-select"
                name="role"
                value={selectPosition}
                onChange={handleRoleChange}

                required
            >
                <option value="" disabled>-- เลือกตำแหน่ง --</option>
                {roleList.map((item, index) => (
                    <option key={index} value={item._id}>{item.role_name}</option>
                ))}
            </select>
            {errorRole && <div className='text-red'>กรุณาเลือกตำแหน่ง</div>}

            <div style={{ height: '10px' }} />
            <label>Username</label>
            <input
                type='text'
                name="username"
                value={editedUser.username}
                onChange={handleChange}
                disabled={editedUser.role_id != "1" ? true : false}
            />
            {errorUsername && <div className='text-red'>กรุณากรอก Username</div>}

            <div style={{ height: '10px' }} />
            <label>{editedUser.role === 'เจ้าของร้าน' ? 'Password' : 'รหัส PIN 6 หลัก'}</label>
            <input
                type={editedUser.role === 'เจ้าของร้าน' ? 'password' : 'text'}
                name="password"
                value={editedUser.password || ''}
                onChange={handleChange}
                minLength={6}
                maxLength={editedUser.role !== 'เจ้าของร้าน' ? 6 : undefined} // Limit PIN to 6 digits
                required
            />
            {errorPassword && <div className='text-red'>กรุณากรอกรหัสผ่าน</div>}

            <div style={{ height: '10px' }} />
            <label>เบอร์โทรศัพท์</label>
            <input
                type="text"
                name="phone_number"
                placeholder='เช่น 0812345678'
                maxLength="10"
                value={editedUser.phone_number || ''}
                onChange={handleChange}
                minLength={10}
                maxLength={10}
                required
            />
            {errorPhone && <div className='text-red'>กรุณากรอกเบอร์โทรศัพท์</div>}

            <div className="order-action-buttons">
                <button className="blue-button" onClick={() => handleSave()}>บันทึก</button>
                <button className="red-button" onClick={onClose}>ยกเลิก</button>
            </div>

        </>
    );
};

export default EditUser;
