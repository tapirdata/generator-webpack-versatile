import express from 'express';
let router = express.Router();
let title = '<%= appnameCap %>';

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', {
    title,
    omitHead: req.xhr
  }
  );
}
);
export default router;
