import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const OrderHistory_table = ({ data = [], onSelectOrder }) => {

    const filteredOrders = data.filter((order) => {
        const includedStatuses = ["เสร็จสิ้น", "ยกเลิก"];
        return includedStatuses.includes(order.orderStatus);
    });

    const columns = [
        { field: 'orderNumber', headerName: 'Order No.', flex:1 },
        { field: 'orderDate', headerName: 'วันที่สั่ง', flex:1 },
        { field: 'orderTime', headerName: 'เวลาที่สั่ง', flex:1 },
        { field: 'orderFinishTime', headerName: 'เวลาที่เสร็จ', flex:1 },
        { field: 'totalPrice', headerName: 'ราคา', flex:1, type: 'number', align: 'left', headerAlign: 'left' },
        {
            field: 'orderStatus',
            headerName: 'สถานะออเดอร์',
           flex:1 , 
            renderCell: (params) => (
                <span className={params.value === 'เสร็จสิ้น' ? 'text-blue' : params.value === 'ยกเลิก' ? 'text-red' : ''}>
                    {params.value}
                </span>
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
                autoPageSize
                disableColumnMenu
                onRowClick={(params) => onSelectOrder(params.row)}
                initialState={{
                    sorting: {
                        sortModel: [
                            { field: 'orderDate', sort: 'desc' }, // เรียงวันที่ล่าสุดมาก่อน
                            { field: 'orderNumber', sort: 'desc' } // ถ้าวันที่ซ้ำกัน ให้ดูที่เลขออเดอร์
                        ],
                    },
                }}
                
            />
        </div>
    );
};

export default OrderHistory_table;
