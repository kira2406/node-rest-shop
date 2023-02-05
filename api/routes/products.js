const express = require('express');
const mongoose = require('mongoose')
const multer = require('multer')

const checkAuth = require('../middleware/check-auth')

const ProductController = require('../controllers/products')
// defining the filename and the destination for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})

// Filter to filter only certain type of files
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }


}

// passing the uploaded file to multer which parses it
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 1024*1024 = 1 MB * 5 = 5 MB
    },
    fileFilter: fileFilter
}) // provide destination to upload the file

const router = express.Router();

const Product = require('../models/product')

router.get('/', ProductController.getAllProducts);

// parsing the uploaded file by passing the request through a middleware
router.post('/', checkAuth, upload.single('productImage'), ProductController.createProduct);

router.get('/:productId', ProductController.getProduct)

router.patch('/:productId', checkAuth, ProductController.updateProduct)

router.delete('/:productId', checkAuth, ProductController.deleteProduct)



module.exports = router;