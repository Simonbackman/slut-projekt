const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Product = require('../models/product');
const News = require('../models/newsLetter');
const imageMimeTypes = ['image/jpeg', 'image/png' /*, 'images/gif'*/];

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/store', (req, res) => {
  res.render('store');
});

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  let query = Product.find();
  let query2 = News.find();
  try {
    const products = await query.exec();
    const news = await query2.exec();
    res.render('admin/dashboard', {
      products: products,
      // searchOptions: req.query,
      name: req.user.name,
      news: news
    });
  } catch {
    res.redirect('/');
  }
});

router.post('/', async (req, res) => {
  const news = new News({
    email: req.body.email
  });
  try {
    const newNews = await news.save();
    res.redirect(`/`);
  } catch {
    res.render('index', {
      news: news,
      errorMessage: 'Error signing up for newsletter'
    });
  }
});
module.exports = router;
