const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Admin = require('../models/Admin');
// Login Page
router.get('/login', (req, res) => {
  res.render('admin/login');
});

// Register Page
router.get('/register', (req, res) => {
  res.render('admin/register');
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
  if (password.length < 6) {
    errors.push({ msg: 'Password need to be at least 8 characters' });
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
                res.redirect('/admins/login');
              })
              .catch(err => console.log(err));
          })
        );
      }
    });
  }
});

module.exports = router;
