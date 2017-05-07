import express from 'express';
let router = express.Router();
let title = '<%= appnameCap %>';

function getSection(req, res, next) {
  const params = {
    title
  };
  res.render('index', params);
  next();
}

router.get('/section/:section/', getSection);

router.get('/', function(req, res) {
  res.redirect('/section/home/');
});

export default router;
