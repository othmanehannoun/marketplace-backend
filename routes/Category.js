var express = require('express');
var router = express.Router();
const CategoryCrtl = require('../controllers/Category-Ctrl')
// const authSeller = require('../middleware/auth-seller')


router.post('/addCategory', CategoryCrtl.AddCategory);

router.get('/allcategory', CategoryCrtl.AllCategoryt);




module.exports = router;