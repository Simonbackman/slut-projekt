const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/store', (req, res) => {
  res.render('store');
});

router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('admin/dashboard', {
    name: req.user.name
  })
);

module.exports = router;
