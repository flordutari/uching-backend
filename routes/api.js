const express = require('express');
const accountRoutes = express.Router();

const Account = require('../models/Account');
const Movement = require('../models/Movement');

const { isLoggedIn } = require('../helpers/middlewares');

accountRoutes.post('/accounts', isLoggedIn(), async (req, res, next) => {
    try {
        const newAccount = await Account.create({
            name: req.body.name,
            movements: [],
            owner: req.session.currentUser._id
        });
        res.status(200);
        res.json(newAccount);
    } catch (error) {
        next(error)
    }
});

accountRoutes.post('/movements', isLoggedIn(), async (req, res, next) => {
    const { amount, currency, category, description, account, date } = req.body;
    try {
        const newMovement = await Movement.create({
            amount:  amount, 
            currency: currency, 
            category: category, 
            description: description, 
            account: account,
            date: date,
        });
        res.status(200);
        res.json(newMovement);
    } catch (error) {
        next(error)
    }
});

module.exports = accountRoutes;
