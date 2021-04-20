const uuid = require('node-uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    transaction_id: {type: String, default: uuid.v4},
    transaction_type: {type: String, required: true},
    user_id: {type: String, required: true},
    type: {type: String, required: true},
    status: {type: String, required: true},
    amount: { type: String, required: true },
    remarks: { type: String, required: false },
    balance_before: { type: String, required: false, default: 0 },
    balance_after: { type: String, required: false, default: 0 },
    created_date: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret.id;
        delete ret._id;
        delete ret.user_id;
    }
});

module.exports = mongoose.model('Transaction', schema);