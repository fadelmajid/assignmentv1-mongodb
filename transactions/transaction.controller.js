const express = require('express');
const router = express.Router();
const trxService = require('./transaction.service');
const userService = require('../users/user.service');
const _ = require('lodash');

// routes
router.get('/', transactions);
router.post('/topup', topup);
router.post('/transfer', transfer);
router.post('/pay', pay);

module.exports = router;

async function topup(req, res, next) {
    try {    
        const user = await userService.getById(req.user.sub);
        const amount = parseInt(req.body.amount) ? parseInt(req.body.amount) : 0;

        const data = {
            user_id: user.user_id,
            amount: amount,
            balance_before: user.balance,
            balance_after: user.balance + amount,
            transaction_type: "CREDIT",
            type: "topup"
        }

        const updatedUser = await userService.update(req.user.sub, { balance : data.balance_after })

        if(updatedUser){
            data.status = "SUCCESS"
        }

        const result = await trxService.create(data)

        res.json({
            status: "SUCCESS",
            result: result
        })
    } catch (error) {
        throw error
    }
}


async function transfer(req, res, next) {
    try {    
        const user = await userService.getById(req.user.sub);
        const amount = parseInt(req.body.amount) ? parseInt(req.body.amount) : 0;
        const target_user = req.body.target_user ? req.body.target_user : '';
        const remarks = req.body.remarks ? req.body.remarks : '';

        if(_.isEmpty(target_user)){
            throw 'Target User is required'
        }

        if(user.user_id == target_user){
            throw `Target User can't be the same as Login User`
        }

        if(user.balance < amount){
            throw 'Balance is not enough'
        }

        const target_data = await userService.getByUserId(target_user)
        if(_.isNull(target_data) || _.isUndefined(target_data)){
            throw `Target User doesn't exists`
        }

        const data = {
            user_id: user.user_id,
            amount: amount,
            balance_before: user.balance,
            balance_after: user.balance - amount,
            transaction_type: "DEBIT",
            type: "transfer",
            remarks: remarks
        }

        const updatedUser = await userService.update(req.user.sub, { balance : data.balance_after })


        const data_target = {
            user_id: target_user,
            amount: amount,
            balance_before: target_data.balance,
            balance_after: target_data.balance + amount,
            transaction_type: "DEBIT",
            type: "transfer",
            remarks: remarks + '. transferred from : ' + user.user_id 
        }
        
        const updatedTargetUser = await userService.update(target_data.id, { balance : data_target.balance_after })

        if(updatedUser && updatedTargetUser){
            data.status = "SUCCESS"
        }

        const result = await trxService.create(data)

        res.json({
            status: "SUCCESS",
            result: result
        })
    } catch (error) {
        next(error)
    }
}


async function pay(req, res, next) {
    try {    
        const user = await userService.getById(req.user.sub);
        const amount = parseInt(req.body.amount) ? parseInt(req.body.amount) : 0;
        const remarks = req.body.remarks ? req.body.remarks : '';

        if(user.balance < amount){
            throw 'Balance is not enough'
        }

        const data = {
            user_id: user.user_id,
            amount: amount,
            balance_before: user.balance,
            balance_after: user.balance - amount,
            transaction_type: "DEBIT",
            type: "payment",
            remarks: remarks
        }

        const updatedUser = await userService.update(req.user.sub, { balance : data.balance_after })

        if(updatedUser){
            data.status = "SUCCESS"
        }

        const result = await trxService.create(data)

        res.json({
            status: "SUCCESS",
            result: result
        })
    } catch (error) {
        next(error)
    }
}

async function transactions(req, res, next) {
    try {
        const user = await userService.getById(req.user.sub);

        let data = {
            user_id: user.user_id
        }

        const result = await trxService.getAll(data);

        res.json({
            status: "SUCCESS",
            result: result
        })

    } catch (error) {
        next(error)
    }
}