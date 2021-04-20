const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db');
const User = db.User;

module.exports = {
    login,
    getAll,
    getById,
    getByUserId,
    create,
    update
};

async function login({ phone_number, pin }) {
    try {
        const user = await User.findOne({ phone_number });
        if (user && bcrypt.compareSync(pin, user.pin)) {
            const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
            return {
                ...user.toJSON(),
                access_token: token
            };
        }
    } catch (error) {
        throw(error)
    }
}

async function getAll() {
    try {   
        return await User.find();   
    } catch (error) {
        throw(error)
    }
}

async function getById(id) {
    try {    
        return await User.findById(id);
    } catch (error) {
        throw(error)
    }
}

async function getByUserId(user_id) {
    try {    
        return await User.findOne({ user_id: user_id});
    } catch (error) {
        throw(error)
    }
}

async function create(userParam) {
    try {        
        // validate
        if (await User.findOne({ phone_number: userParam.phone_number })) {
            throw 'Phone number "' + userParam.phone_number + '" already registered';
        }

        const user = new User(userParam);

        // hash pin
        if (userParam.pin) {
            user.pin = bcrypt.hashSync(userParam.pin, 10);
        }

        // save user
        await user.save();

        return await User.findOne({ phone_number: userParam.phone_number })
    } catch (error) {
        throw(error)
    }}

async function update(id, data) {
    try {   
        const user = await User.findOneAndUpdate({ _id: id }, data, {
            new: true
        });

        return user   
    } catch (error) {
        throw(error)
    }
}