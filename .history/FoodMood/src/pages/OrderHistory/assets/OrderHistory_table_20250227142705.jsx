import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const OrderHistory_table = ({ data = [] }) => {

    const filteredOrders = data.filter((order) => {
        const includedStatuses = ["เสร็จสิ้น", "ยกเลิก"];
        return includedStatuses.includes(order.orderStatus);
    });
    

    const columns = [
        { field: 'orderNumber', headerName: 'Order No.', width: 160 },
        { field: 'orderDate', headerName: 'วันที่สั่ง', width: 130 },
        { field: 'orderTime', headerName: 'เวลาที่สั่ง', width: 100 },
        { field: 'contactInfo', headerName: 'หมายเลขโต๊ะ', type: 'number', width: 120 },
        { field: 'total', headerName: 'ราคา', type: 'number', width: 140 },
        { field: 'orderStatus', headerName: 'สถานะออเดอร์', width: 140,
            renderCell: (params) => (
                <span className={params.value === 'สำเร็จ' ? 'text-blue' : params.value === 'ยกเลิก' ? 'text-red' : ''}>
                    {params.value}
                </span>
            )
        },
        { field: 'actions', headerName: '', type: 'number', width: 150, sortable: false,
            renderCell: (params) => (
                <>
                    <button className="edit-btn">&gt ดูรายละเอียดออเดอร์</button>
                </>
            )
        }
    ];

    return (
        <div style={{ height: '90%', width: '100%', marginTop: '8px' }}>
            <DataGrid
                getRowId={(row) => row._id} 
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

export default OrderHistory_table;