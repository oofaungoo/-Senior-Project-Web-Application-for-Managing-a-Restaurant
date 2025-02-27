import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';

const UserTable = ({ data = [], onEdit, roleOptions, handleClickConfirm }) => {
    
    const getRoleName = (roleId) => {
        console.log("Mapping role_id:", roleId); // 🔥 Debug ตรงนี้
        const role = roleOptions.find(r => r._id === roleId);
        console.log("Found role:", role); // 🔥 Debug ตรงนี้
        return role ? role.role_name : 'ไม่ทราบตำแหน่ง';
    };
    console.log("roleOptions:", roleOptions);


    const columns = [
        { field: 'username', headerName: 'Username', flex: 1, minWidth: 150 },
        { field: 'name', headerName: 'ชื่อ', flex: 1, minWidth: 130 },
        { 
            field: 'role_id', 
            headerName: 'ตำแหน่ง', 
            flex: 1, 
            minWidth: 140,  
            valueGetter: (params) => getRoleName(params.value)
        },
        { 
            field: 'phone_number', 
            headerName: 'เบอร์โทร', 
            flex: 1, 
            minWidth: 140, 
            align: 'left', 
            headerAlign: 'left' 
        },
        {
            field: 'actions', 
            headerName: 'Edit & Delete', 
            flex: 1, 
            minWidth: 150, 
            sortable: false,
            renderCell: (params) => (
                <>
                    <button className="edit-btn" onClick={() => onEdit(params.row)}>✏️</button>
                    <button className="edit-btn text-red" onClick={() => handleClickConfirm(params.row)}>
                        <FaRegTrashAlt />
                    </button>
                </>
            )
        }
    ];

    return (
        <div style={{ height: '83vh', width: '100%' }}>
            <DataGrid
                getRowId={(row) => row._id}
                rows={data}
                columns={columns}
                autoPageSize  // ปรับขนาดตามข้อมูลอัตโนมัติ
                sx={{ fontSize: 16, fontFamily: 'inherit' }}
                disableSelectionOnClick
                disableColumnMenu
            />
        </div>
    );
};

export default UserTable;
