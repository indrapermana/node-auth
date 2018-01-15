var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: '/uploads' });
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Register' });
});
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login' });
});
router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
});

router.post('/register', upload.single('profileimage'), function (req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password;

  if (req.file) {
    console.log('Uploading file...');
    var imageFileName = req.file.filename;
  } else {
    console.log('No file uploaded...');
    var imageFileName = 'noimage.jpg';
  }

  // Form validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email field is not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Confirm Password field is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(password);

  // Check Errors
  var errors = req.validationErrors();

  if (errors) {
    console.log('Errors');
    res.render('register', {
      errors: errors
    });
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: imageFileName
    });

    User.createUser(newUser, function (err, user) {
      if (err) throw err
      console.log(user);
    });

    req.flash('success', 'You are now registered and can login');
    res.location('/');
    res.redirect('/');
  }
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: 'Invalid username or password' }), function (req, res) {
    req.flash('success', 'You are now logged in');
    res.redirect('/');
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  User.getUserByUsername(username, function(err, user) {
    if (err) throw err;
    if (!user) {
      return done(null, false, {message: 'Unknown user'});
    }

    User.comparePassword(password, user.password, function(err, isMatch) {
      if (err) return done(err);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invalid password'});
      }
    });
  });
}));

module.exports = router;
