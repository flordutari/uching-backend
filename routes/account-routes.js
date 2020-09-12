const express = require('express');
const accountRoutes = express.Router();

const User = require('../models/User');
const Account = require('../models/Account');

const { isLoggedIn } = require('../helpers/middlewares');

accountRoutes.post('/accounts', isLoggedIn(), async (req, res, next) => {
    try {
        const newAccount = await Account.create({
            name: req.body.name,
            movements: [],
            owner: req.user._id
        });
        res.status(200);
        res.json(newAccount);
    } catch (error) {
        next(error)
    }
});

module.exports = accountRoutes;
