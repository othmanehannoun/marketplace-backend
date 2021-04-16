var express = require('express');
var router = express.Router();

const {AddProduct, getProductById, AllProducts, fetchProductById, showImageSingle, getProductByCategory} = require('../controllers/products-Ctrl');



// -------- Add Product ----------//
router.post('/AddProduct',showImageSingle, AddProduct)

// -------- fetch All Products ----------//
router.get('/AllProducts', AllProducts)

// -------- fetch Product by ID----------//
router.get('/product/:id', getProductById)

router.get('/sellerProducts/:id_seller', fetchProductById)

router.get('/productName/:catName', getProductByCategory);



module.exports = router;