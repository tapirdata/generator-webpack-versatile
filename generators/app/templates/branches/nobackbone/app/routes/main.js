var express = require('express');
var router = express.Router();

var title = '<%= _.capitalize(appname) %>';

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: title, omitHead: req.xhr });
});

router.get('/about', function(req, res) {
  res.render('about', { title: title, omitHead: req.xhr });
});

module.exports = router;

