const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Product = require('../models/product');
const imageMimeTypes = ['image/jpeg', 'image/png' /*, 'images/gif'*/];

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/store', (req, res) => {
  res.render('store');
});

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  let query = Product.find();
  try {
    const products = await query.exec();
    res.render('admin/dashboard', {
      products: products,
      searchOptions: req.query,
      name: req.user.name
    });
  } catch {
    res.redirect('/');
  }
});
module.exports = router;
