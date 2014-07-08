var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express', omitHead: req.xhr });
});

router.get('/about', function(req, res) {
  res.render('about', { title: 'Express', omitHead: req.xhr });
});

module.exports = router;

