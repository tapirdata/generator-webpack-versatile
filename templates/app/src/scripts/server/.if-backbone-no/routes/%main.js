import express from 'express';
let router = express.Router();
let title = '<%= appnameCap %>';

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index',
    {title});
}
);
router.get('/about', function(req, res) {
  res.render('about',
    {title});
}
);
router.get('/contact', function(req, res) {
  res.render('contact',
    {title});
}
);
export default router;
