const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controller/auth');
const { jwtAuth } = require('../middleware/userAuth');
const uploadProducts = require('../controller/products');
const orders = require('../controller/orders');

// api's
router.post('/signup', signup);
router.post('/signin', signin);

// below api's are authenticated with jwt 
router.use('/*', jwtAuth);
router.use('/uploadProducts', uploadProducts);
router.use('/orders', orders);

module.exports = router;