express = require('express')
router = express.Router()
title = '<%= _.capitalize(appname) %>'

### GET home page. ###

router.get '/', (req, res) ->
  res.render 'index',
    title: title
    omitHead: req.xhr
  return
router.get '/about', (req, res) ->
  res.render 'about',
    title: title
    omitHead: req.xhr
  return
module.exports = router
