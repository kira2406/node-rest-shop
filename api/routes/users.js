const express = require('express')
const router = express.Router()

const UserController = require('../controllers/users')

router.post('/signup', UserController.userSignup)

router.post('/login', UserController.userLogin)

router.delete('/:userId', UserController.deleteUser)


module.exports = router