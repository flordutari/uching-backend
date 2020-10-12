const express = require('express');
const authRoutes = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');

const { isLoggedIn, isNotLoggedIn, validationLoggin } = require('../helpers/middlewares');

authRoutes.get('/me', isLoggedIn(), (req, res, next) => {
    res.json(req.session.currentUser);
});

authRoutes.post('/signup', isNotLoggedIn(), validationLoggin(), (req, res, next) => {
    const { name, surname, email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Provide mail and password please.' });
        return;
    }

    if (password.length <= 7) {
        res.status(400).json({ message: 'Please, make your password at least 8 characters long for security purposes.' });
        return;
    }

    User.findOne({
        email
        }, 'email')
        .then((userExists) => {
        if (userExists) {
            return res.status(422).json({ message: 'Email already registered' });
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hashPass = bcrypt.hashSync(password, salt);

            const newUser = new User({
                name,
                surname,
                email,
                password: hashPass
            });

            return newUser.save()
            .then(() => {
            // TODO delete password 
            req.session.currentUser = newUser;
            res.status(200).json(newUser);
            });
        }
        })
        .catch(next);
});

authRoutes.post('/login', isNotLoggedIn(), validationLoggin(), (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({
        email
        })
        .then((user) => {
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }
        if (bcrypt.compareSync(password, user.password)) {
            req.session.currentUser = user;
            return res.status(200).json(user);
        } else {
            return res.status(401).json({ message: 'Email or password incorrect' });
        }
        })
        .catch(next);
});

authRoutes.post('/logout', isLoggedIn(), (req, res, next) => {
    req.session.destroy();
    return res.status(204).send();
});

module.exports = authRoutes;
