import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { DataGrid } from '@mui/x-data-grid';

const IngredientTable = ({ data = [], onEdit, handleClickConfirm }) => {

    const columns = [
        { field: 'name', headerName: 'วัตถุดิบ', flex: 1, width: 140 },
        //{ field: 'group', headerName: 'หมวดหมู่', flex: 1, width: 100 },
        { field: 'remain', headerName: 'คงเหลือ', type: 'number', flex: 1, width: 100  },
        { field: 'min', headerName: 'ขั้นต่ำ', type: 'number', flex: 1, width: 120 },
        //{ field: 'unit', headerName: 'หน่วย', type: 'number', flex: 1, width: 70 },
        {
            field: 'actions', headerName: 'Edit & Delete', type: 'number', flex: 1, width: 100,  sortable: false,
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
        <div style={{ height: '90%', width: '100%' }}>
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

// โค้ดตารางแบบเก่า กรณีจะใช้งาน
{/* 
    return (
        <table className="ingredient-table">
            <thead>
                <tr>
                    <th>ชื่อวัตถุดิบ</th>
                    <th>หมวดหมู่</th>
                    <th>ปริมาณคงเหลือ</th>
                    <th>ปริมาณขั้นต่ำ</th>
                    <th>หน่วย</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {data.map((ingredient, index) => (
                    <tr key={ingredient.id}>
                        <td>{ingredient.name}</td>
                        <td>{ingredient.group}</td>
                        <td>{ingredient.remain}</td>
                        <td>{ingredient.min}</td>
                        <td>{ingredient.unit}</td>
                        <td>
                            <button className="edit-btn" onClick={() => onEdit(ingredient)}>✏️</button>
                            <button className="edit-btn text-red" onClick={() => handleClickConfirm(ingredient)}><FaRegTrashAlt /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
*/}

export default IngredientTable;