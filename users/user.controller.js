const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const moment = require('moment');

// routes
router.post('/login', login);
router.post('/register', register);
router.get('/profile', get);
router.put('/profile', update);

module.exports = router;

async function login(req, res, next) {
    try {
        let result = await userService.login(req.body)

        result ? res.json(result) : res.status(400).json({ message: 'Phone number or pin is incorrect' })
    } catch (error) {
        next(error)
    }
}

async function register(req, res, next) {
    try {
        let result = await userService.create(req.body)

        res.json({
            status: "SUCCESS",
            result: result
        })
    } catch (error) {
        next(error)    
    }
}

async function update(req, res, next) {
    try {            
        const existingData = await userService.getById(req.user.sub)

        const data = {
            first_name: req.body.first_name ? req.body.first_name : existingData.first_name,
            last_name: req.body.last_name ? req.body.last_name : existingData.last_name,
            address: req.body.last_name ? req.body.address : existingData.address,
            updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
        }

        let result = await userService.update(req.user.sub, data)

        res.json({
            status: "SUCCESS",
            result: result
        })
    } catch (error) {
        next(error)
    }
}


async function get(req, res, next) {
    try {
        let result = await userService.getById(req.user.sub)

        res.json({
            status: "SUCCESS",
            result: result
        })
    } catch (error) {
        next(error)
    }
}
