const express = require('express')
const app = express()
const morgan = require('morgan') // Logger
const bodyParser = require('body-parser')

const productRoutes = require("./api/routes/products")
const orderRoutes = require("./api/routes/orders")

// middlewares
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false })) // extended : true => supporst extended bodies with rich data
app.use(bodyParser.json())

app.use((req, res, next) => {

    // Preventing CORS error
    res.header('Access-Control-Allow-Origin', '*') // Defining access to client
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization') // Define which kind of headers we want to accept

    // Browsers send an OPTIONS request before sending a POST or PATCH request
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }

    next();
})

// Routes
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

app.use((req, res, next) => {
    const error = new Error('url not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;