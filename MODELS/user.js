const mongoose = require('mongoose');//imports mongoose database

//schema 
const userSchema = mongoose.Schema({
    name:{ type: String, required: true},
    email: { type: String, required: true},
    passwordHash:{ type: String, required: true},
    street:{ type: String, required: true},
    apartment:{ type: String, default: ''},
    city: { type: String, default: ''},
    zip: { type: String, default: ''},
    country:{ type: String, default: ''},
    phone:{ type: String, required: true},
    isAdmin:{ type: Boolean, default: false}
});
userSchema.virtual('id').get(function(){//creating a virtual id and it is more front end/user friendly
    return this._id.toHexString();
});
userSchema.set('toJSON', {//enabling the virtuals to this schema for virtual id
    virtuals: true,
});

 exports.User = mongoose.model('User', userSchema);
 exports.userSchema = userSchema;