import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';

const IngredientTable = ({ data = [], onEdit, handleClickConfirm }) => {
    const columns = [
        { field: 'name', headerName: 'วัตถุดิบ', flex: 1, width: 140 },
        { field: 'group', headerName: 'หมวดหมู่', flex: 1, width: 100 },
        { field: 'remain', headerName: 'คงเหลือ', type: 'number', flex: 1, width: 100 , headerAlign: 'left', align: 'left' },
        { field: 'min', headerName: 'ขั้นต่ำ', type: 'number', flex: 1, width: 120, headerAlign: 'left', align: 'left' },
        { field: 'unit', headerName: 'หน่วย', flex: 1, width: 70 },
        {
            field: 'actions', headerName: 'Edit & Delete', flex: 1.2, width: 120,  sortable: false,
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
                autoPageSize
                disableSelectionOnClick
                disableColumnMenu
            />
        </div>
    );
};

export default IngredientTable;