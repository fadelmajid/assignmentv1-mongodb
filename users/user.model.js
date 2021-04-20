const uuid = require('node-uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: {type: String, default: uuid.v4},
    pin: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    address: { type: String, required: true },
    phone_number: { type: String, unique: true, required: true },
    balance: { type: Number, required: false, default: false },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, required: false }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret.id;
        delete ret._id;
        delete ret.pin;
    }
});

module.exports = mongoose.model('User', schema);