const express = require('express');
const router  = express.Router();
const nodeMailer = require('nodemailer');

const productController = require('../controllers/productControllers');
const UserController = require('../controllers/userControllers');
const Authenticate = require('../../middleware/checkAuth');
const OrderController = require('../controllers/OrderControllers');

router.get('/showProducts',productController.showProducts);

router.post('/login',UserController.login);

router.post('/register',UserController.register);

router.post('/isLogin',Authenticate,(req,res) =>{
    res.status(200).json({message:'Authenticated user',user:req.user});
})

router.post('/checkout',Authenticate,OrderController.placeOrder)

module.exports = router