import React from 'react';
import {FaRegTrashAlt} from 'react-icons/fa';

const UserTable = ({ data = [], onEdit, roleOptions, handleClickConfirm }) => {
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
