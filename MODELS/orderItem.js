const mongoose = require('mongoose');
const { Product } = require('./product');

const orderItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type:Number,
        required: true
    }
})

exports.orderItem = mongoose.model('orderItem', orderItemSchema);