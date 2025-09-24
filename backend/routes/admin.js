const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const logincheck = require('../middleware/logincheck').logincheck ;

const router = express.Router();




router.get('/add-product',logincheck, adminController.getAddProduct);

router.get('/products',logincheck, adminController.getProducts);


router.post('/add-product', logincheck,adminController.postAddProduct);

router.get('/edit-product/:productId',logincheck,adminController.editproduct)
router.post('/edit-product',logincheck,adminController.posteditProduct)

router.post('/delete-product',logincheck,adminController.deleteproduct) ;

module.exports = router;
