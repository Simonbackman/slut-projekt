if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');

// passport config
require('./config/passport')(passport);
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('connected to db!')
);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
// express bodyparser
app.use(express.urlencoded({ limit: '10mb', extended: false }));

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
// passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', require('./routes/index'));
app.use('/admins', require('./routes/admins'));
app.use('/products', require('./routes/products'));
// 404 page
app.get('*', (req, res) => res.render(__dirname + '\\views\\404.ejs'));

// app.listen(process.env.PORT || 2000);

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server up and running att http://localhost:${PORT}`);
});
