const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String
    },
    customerName: {
        type: String
    },
    mobileNumber: {
        type: String
    },
    productId: {
        type: ObjectId,
        ref: 'product'
    },
    productQuantity: {
        type: Number,
        default: 1
    },
    date: {
        type: Number,
        default: Date.now()
    },
    status: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('order', orderSchema);