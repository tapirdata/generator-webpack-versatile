'use strict'
express = require('express')
router = express.Router()
title = '<%= appnameCap %>'

### GET home page. ###

router.get '/', (req, res) ->
  res.render 'index',
    title: title
    omitHead: req.xhr
  return
module.exports = router
