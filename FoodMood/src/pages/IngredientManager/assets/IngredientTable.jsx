import React, { useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';

const IngredientTable = ({ data = [], onEdit, handleClickConfirm }) => {
    const [paginationModel, setPaginationModel] = useState({ pageSize: 20, page: 0 });

    const columns = [
        { field: 'name', headerName: 'วัตถุดิบ', width: 140, flex: 1,
            renderCell: (params) => (
                <span style={{ color: params.row.min > params.row.remain ? '#ff7878' : 'inherit' }}>
                    {params.value}
                </span>
            ) },
        { field: 'group', headerName: 'หมวดหมู่', width: 140, flex: 1,
            renderCell: (params) => (
                <span style={{ color: params.row.min > params.row.remain ? '#ff7878' : 'inherit' }}>
                    {params.value}
                </span>
            ) },
        {
            field: 'remain', headerName: 'คงเหลือ', type: 'number', width: 140, flex: 1, headerAlign: 'left', align: 'left',
            renderCell: (params) => (
                <span style={{ color: params.row.min > params.row.remain ? '#ff7878' : 'inherit' }}>
                    {params.value}
                </span>
            )
        },
        { field: 'min', headerName: 'ขั้นต่ำ', type: 'number', width: 140, flex:1, headerAlign: 'left', align: 'left',
            renderCell: (params) => (
                <span style={{ color: params.row.min > params.row.remain ? '#ff7878' : 'inherit' }}>
                    {params.value}
                </span>
            ) },
        { field: 'unit', headerName: 'หน่วย', width: 70, flex: 1,
            renderCell: (params) => (
                <span style={{ color: params.row.min > params.row.remain ? '#ff7878' : 'inherit' }}>
                    {params.value}
                </span>
            ) },
        {
            field: 'actions', headerName: 'Edit & Delete', width: 120, flex: 1, sortable: false,
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
        <div style={{ height: '85%', width: '100%' }}>
            <DataGrid
                getRowId={(row) => row._id}
                rows={data}
                columns={columns}
                sx={{ fontSize: 16, fontFamily: 'inherit' }}
                autoPageSize={false} // ปิด autoPageSize เพื่อให้เลือกจำนวนแถวเองได้
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[20, 50, 100]} // ตัวเลือกจำนวน row ที่ให้ user เลือก
                disableSelectionOnClick
                disableColumnMenu
            />
        </div>
    );
};

export default IngredientTable;