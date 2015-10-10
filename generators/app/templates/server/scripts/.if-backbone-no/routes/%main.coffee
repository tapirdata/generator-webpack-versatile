'use strict'

express = require('express')
router = express.Router()
title = '<%= appnameCap %>'

### GET home page. ###

router.get '/', (req, res) ->
  res.render 'index',
    title: title
  return
router.get '/about', (req, res) ->
  res.render 'about',
    title: title
  return
router.get '/contact', (req, res) ->
  res.render 'contact',
    title: title
  return
module.exports = router
