const express = require('express');

const router = express.Router();

const { signup, signin } = require('../controller/auth');
// const { uploadProducts } = require('../controller/products')
const { jwtAuth } = require('../middleware/userAuth');
const uploadProducts = require('../controller/products');

router.post('/signup', signup);
router.post('/signin', signin);

router.use('/*', jwtAuth);
router.use('/uploadProducts', uploadProducts)

module.exports = router;