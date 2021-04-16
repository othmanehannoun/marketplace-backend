var express = require('express');
var router = express.Router();
const AdminCtrl = require('../controllers/admin-Crtl')
// const auth = require('../middleware/auth')


router.post('/AdminRegister', AdminCtrl.adminRegister);

router.post('/Adminlogin', AdminCtrl.login);

router.get('/getadmin', AdminCtrl.getAdmin);

router.get('/getllAdmin', AdminCtrl.getAdmin);


module.exports = router;