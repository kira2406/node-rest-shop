const Order = require('../models/order')
const mongoose = require('mongoose')

exports.get_all = (req, res, next) => {
    Order.find()
        .select("product quantity _id")
        .populate('product', 'name _id')
        .exec()
        .then(docs => {
            console.log(docs)
            res.status(200).json(({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                }),

            }))
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}

exports.create = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(400).json({
                    message: "Product not found"
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            })
            return order.save()
                .then(result => {
                    console.log(result)
                    res.status(200).json({
                        message: 'Order stored',
                        createdOrder: {
                            _id: result._id,
                            product: result.product,
                            quantity: result.quantity
                        },
                        request: {
                            type: 'GET',
                            url: "http://localhost:3000/orders/" + result._id
                        }
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        })

}

exports.get_one = (req, res, next) => {
    const id = req.params.orderId
    Order.findById({ _id: id })
        .populate('product') // fetching data about the product
        .exec()
        .then(doc => {
            console.log(doc)
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Fetch all orders from database',
                        url: 'http://localhost/orders'
                    }
                })
            }
            else {
                res.status(404).json({
                    error: "No valid Order object found for given id"
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

exports.delete = (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            if (result.deletedCount) {
                res.status(200).json({
                    message: "Order deleted"
                })
            } else {
                res.status(500).json({
                    error: "Product could not be deleted"
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
    res.status(200).json({
        message: 'Order deleted'
    })
}