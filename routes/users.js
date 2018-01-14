var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: '/uploads'});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
});
router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});
router.get('/logout', function(req, res, next) {
  res.render('register');
});

router.post('/register', upload.single('profileimage'), function(req, res, next) {
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
    console.log('No errors');
  }
});

module.exports = router;
