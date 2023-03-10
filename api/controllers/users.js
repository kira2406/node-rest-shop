const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require("../models/user")

exports.userSignup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            console.log(user)
            if (user.length > 0) {
                res.status(409).json({
                    message: 'Mail exists'
                })    // 409 - conflict, 422 - unprocessable request
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                            .then(result => {
                                console.log(result)
                                res.status(201).json({
                                    message: 'User created'
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({
                                    error: err
                                })
                            })

                    }
                })
            }
        })

}

exports.userLogin = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            console.log(user)
            if (user.length < 1) {
                res.status(401).json({
                    message: 'Auth failed'
                })
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: 'Auth failed'
                        })
                    }
                    if (result) {
                        const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "1h"
                            },
                        )
                        return res.status(200).json({
                            message: 'Auth successful',
                            token: token
                        })
                    } else {
                        return res.status(401).json({
                            message: 'Auth failed',
                        })
                    }
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}

exports.deleteUser = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            if (result.deletedCount) {
                res.status(200).json({
                    message: "User deleted"
                })
            } else {
                res.status(500).json({
                    error: "User could not be deleted"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}