const mongoose = require('mongoose');
const { User } = require('./user');


const orderSchema = mongoose.Schema({
    orderItems: [{//order items are an array of products i.e order items
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orderItem',
        required: true
    }],
    shippingAddress1: { type: String, required: true},
    shippingAddress2: { type: String, required: true},
    city: { type: String, required: true},
    zip: { type: String, required: true},
    country: { type: String, required: true},
    phone: { type: Number, required: true},
    status: { type: String, required: true, default: 'Pending'},
    totalPrice: { type: Number},
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    dateOrdered: { type: Date, default: Date.now}
})
orderSchema.virtual('id').get(function () { //creating a virtual id instead of '_id' simply beacuse itll be easier for the front end to deal with the id
    return this._id.toHexString();
});
orderSchema.set('toJSON', {
    virtuals: true
})


exports.Order = mongoose.model('Order', orderSchema);