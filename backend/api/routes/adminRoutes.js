const express = require('express');
const router = express.Router();

const adminController = require('../controllers/productControllers');

router.post('/addProduct',adminController.addProduct);

module.exports = router