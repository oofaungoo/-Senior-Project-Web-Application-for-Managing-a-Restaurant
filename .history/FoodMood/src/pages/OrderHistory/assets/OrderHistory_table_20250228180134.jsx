import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const OrderHistory_table = ({ data = [], onSelectOrder }) => {

    const filteredOrders = data.filter((order) => {
        const includedStatuses = ["เสร็จสิ้น", "ยกเลิก"];
        return includedStatuses.includes(order.orderStatus);
    });

    const columns = [
        { field: 'orderNumber', headerName: 'Order No.' },
        { field: 'orderDate', headerName: 'วันที่สั่ง' },
        { field: 'orderTime', headerName: 'เวลาที่สั่ง' },
        { field: 'orderFinishTime', headerName: 'เวลาที่เสร็จ' },
        { field: 'totalPrice', headerName: 'ราคา', type: 'number', align: 'left', headerAlign: 'left' },
        {
            field: 'orderStatus',
            headerName: 'สถานะออเดอร์',
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
                            { field: 'orderDate', sort: 'desc' }, // เรียงลำดับวันที่ล่าสุดมาก่อน
                            { field: 'orderNumber', sort: 'desc' } // เผื่อมีวันที่ซ้ำกัน ให้ดูที่ orderNumber ต่อ
                        ],
                    },
                }}
            />
        </div>
    );
};

export default OrderHistory_table;
