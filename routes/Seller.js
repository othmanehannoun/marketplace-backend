var express = require('express');
var router = express.Router();
const SellerCtrl = require('../controllers/seller-Crtl')
const authSeller = require('../middleware/auth-seller')


router.post('/register', SellerCtrl.register);

router.patch('/update', authSeller, SellerCtrl.resetPassword);

router.post('/login', SellerCtrl.Login);

router.get('/getAllSeller', SellerCtrl.getAllSeller);

router.patch('/valid/:id', SellerCtrl.validSeller);

router.get('/logout', SellerCtrl.sellerSignout)


module.exports = router;