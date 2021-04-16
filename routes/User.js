var express = require('express');
var router = express.Router();
const userCtrl = require('../controllers/users-Ctrl')
const auth = require('../middleware/auth')


router.post('/register', userCtrl.register);

router.post('/login', userCtrl.login);

router.get('/info', auth, userCtrl.getUser);


module.exports = router;