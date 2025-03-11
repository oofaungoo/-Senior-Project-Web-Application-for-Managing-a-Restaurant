const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        default: 0
    },
    employeeName: {
        type: String,
        default: ''
    },
    paidType: {
        type: String,
        default: ''
    },
    orderDate: {
        type: String,
        default: ''
    },
    orderTime: {
        type: String,
        default: ''
    },
    orderFinishTime: {
        type: String,
        default: ''
    },
    orderItems: [
        {
            name: {
                type: String,
                default: ''
            },
            category: {
                type: String,
                default: ''
            },
            size: {
                type: String,
                default: ''
            },
            quantity: {
                type: Number,
                default: 1 // ค่าเริ่มต้นเป็น 1
            },
            note: {
                type: String,
                default: ''
            },
            selectedOptions: {
                type: Map,
                of: String,
                default: () => ({}) // ต้องใช้ฟังก์ชันเพื่อคืนค่า object เปล่า
            },
            price: {
                type: Number,
                default: 0
            }
        }
    ],
    orderType: {
        type: String,
        default: ''
    },
    contactInfo: {
        phoneNumber:{
            type: String,
            default: ''
        },
        tableNumber:{
            type: String,
            default: ''
        },
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    orderStatus: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('orders', orderSchema);
