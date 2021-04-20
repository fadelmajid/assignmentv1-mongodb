const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db');
const Transaction = db.Transaction;

module.exports = {
    create,
    getAll
};

async function create(data) {
    try {
        const trx = new Transaction(data);

        const saved = await trx.save();

        const result = await Transaction.findById(saved.id);

        return result;
    } catch (error) {
        throw error
    }
}


async function getAll(data) {    
    try {    
        return await Transaction.find({
            user_id: data.user_id
        }).sort({ created_date: -1 });
    } catch (error) {
        throw error   
    }
}