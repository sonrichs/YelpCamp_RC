const express = require('express')
const router = express.Router()
const catchAsync = require('../utilities/catchAsync')
const passport = require('passport')
const { storeReturnTo } = require('../middleware')
const users = require('../controllers/users')

router.get('/register', users.renderRegisterForm)

router.post('/register', catchAsync(users.register))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login',
    storeReturnTo,
    passport.authenticate('local',
        { failureFlash: true, failureRedirect: '/login' }),
    users.login)

router.get('/logout', users.logout);

module.exports = router