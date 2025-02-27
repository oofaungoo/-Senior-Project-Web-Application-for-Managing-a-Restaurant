const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        default: 0 // ค่าเริ่มต้นเป็น 1 แทน ''
    },
    employeeName: {
        type: String,
        default: ''
    },
    orderDate: {
        type: String,
        default: () => new Date().toISOString().split('T')[0] // YYYY-MM-DD
    },
    orderTime: {
        type: String,
        default: () => new Date().toLocaleTimeString() // HH:mm:ss AM/PM
    },
    orderItems: [
        {
            name: {
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
