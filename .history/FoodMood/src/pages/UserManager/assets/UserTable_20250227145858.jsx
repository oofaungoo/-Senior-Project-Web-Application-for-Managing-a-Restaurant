import React from 'react';
import {FaRegTrashAlt} from 'react-icons/fa';

const UserTable = ({ data = [], onEdit, roleOptions, handleClickConfirm }) => {
    
    const columns = [
        { field: 'username', headerName: 'Username', width: 160, flex: 1 },
        { field: 'name', headerName: 'ชื่อ', width: 130, flex: 2 },
        { field: 'role_id', headerName: 'ตำแหน่ง', width: 100, flex: 2 },
        { field: 'phone_number', headerName: 'เบอร์โทร', type: 'number', width: 140, flex: 1, align: 'left', headerAlign: 'left' },
        { 
            field: 'orderStatus', 
            headerName: 'สถานะออเดอร์', 
            width: 140, 
            flex: 1,
            renderCell: (params) => (
                <span className={params.value === 'เสร็จสิ้น' ? 'text-blue' : params.value === 'ยกเลิก' ? 'text-red' : ''}>
                    {params.value}
                </span>
            )
        }
    ];

    return (
        <table className="ingredient-table">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>ชื่อ</th>
                    <th>ตำแหน่ง</th>
                    <th>เบอร์โทร</th>
                    <th>Edit</th>
                    <th>delete</th>
                </tr>
            </thead>
            <tbody>
                {data.map((user,index) => (
                    <tr key={user.index}>
                        <td>{user.username}</td>
                        <td>{user.name}</td>
                        <td>{roleOptions.find(role => role._id === user.role_id)?.role_name }</td>
                        <td>{user.phone_number}</td>
                        <td>
                            <button className="edit-btn" onClick={() => onEdit(user)}>✏️</button>
                        </td>
                        <td>
                            <button className="edit-btn text-red" onClick={() => handleClickConfirm(user)}><FaRegTrashAlt /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UserTable;
