const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');

const Admin = require('../models/Admin');
// Login Page
router.get('/login', (req, res) => {
  res.render('admin/login');
});

// Register Page
router.get('/register', ensureAuthenticated, (req, res) => {
  res.render('admin/register', {
    name: req.user.name
  });
});

// Register Handler
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields and try again' });
  }
  if (password !== password2) {
    errors.push({ msg: 'Password do not match' });
  }
  if (password.length < 5) {
    errors.push({ msg: 'Password need to be at least 5 characters' });
  }
  if (errors.length > 0) {
    res.render('admin/register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // if register was succesfull
    Admin.findOne({ email: email }).then(admin => {
      if (admin) {
        errors.push({ msg: 'Email allready exits' });
        res.render('admin/register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newAdmin = new Admin({
          name,
          email,
          password
        });
        //encrypting password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) throw err;
            newAdmin.password = hash;
            newAdmin
              .save()
              .then(admin => {
                req.flash('success_msg', 'account now registerd');
                res.redirect('/admins/register');
              })
              .catch(err => console.log(err));
          })
        );
      }
    });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/admins/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'you are logged out');
  res.redirect('/admins/login');
});
module.exports = router;
