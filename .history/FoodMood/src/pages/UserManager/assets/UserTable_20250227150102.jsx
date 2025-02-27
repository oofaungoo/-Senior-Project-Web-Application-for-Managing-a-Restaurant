import React from 'react';
import {FaRegTrashAlt} from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';

const UserTable = ({ data = [], onEdit, roleOptions, handleClickConfirm }) => {
    
    const columns = [
        { field: 'username', headerName: 'Username', width: 160, flex: 2 },
        { field: 'name', headerName: 'ชื่อ', width: 130, flex: 2 },
        { field: 'role_id', headerName: 'ตำแหน่ง', width: 100, flex: 2 },
        { field: 'phone_number', headerName: 'เบอร์โทร', type: 'number', width: 140, flex: 1, align: 'left', headerAlign: 'left' },
        {
                    field: 'actions', headerName: 'Edit & Delete', flex: 1.1, width: 100,  sortable: false,
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
            <div style={{ height: '83%', width: '100%' }}>
                <DataGrid
                    getRowId={(row) => row._id}     //เชื่อมกับ id ใน database ของเรา แต่ id ใน database เป็น _id
                    rows={data}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    sx={{ fontSize: 16, fontFamily: 'inherit' }}
                    disableSelectionOnClick
                    disableColumnMenu
                />
            </div>
        );
};

export default UserTable;
