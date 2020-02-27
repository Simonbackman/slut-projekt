const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Product = require('../models/product');
const News = require('../models/newsLetter');
const imageMimeTypes = ['image/jpeg', 'image/png' /*, 'images/gif'*/];
const fs = require('fs');
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

const stripe = require('stripe')(stripeSecretKey);

router.use(express.json());

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/store', async (req, res) => {
  let query = Product.find();
  try {
    const products = await query.exec();
    res.render('store', {
      products: products,
      stripePublicKey: stripePublicKey
    });
  } catch {
    res.redirect('/');
  }
});

router.post('/purchase', async (req, res) => {
  // fs.readFile("items.json", (error, data) => {
  // if (error) {
  //   res.status(500).end();
  // } else {
  console.log(req.body);
  var total = 0;
  req.body.products.forEach(product => {
    total = total + product.price * product.quantity;
  });

  // const charge = await
  stripe.charges
    .create({
      amount: total,
      source: req.body.stripeTokenId,
      currency: 'usd'
    })
    .then(() => {
      console.log('Charge Successful');
      res.json({ message: 'Successfully purchased items' });
    })
    .catch(() => {
      console.log('Charge Fail');
      res.status(500).end();
    });
  //}
  // });
});

// router.get("/store", (req, res) => {
//   res.render("store");
// });

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
