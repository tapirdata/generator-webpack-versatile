import express from 'express';
<% if (use.serverRender) { -%>
import path from 'path';
import pug from 'pug';
import { allSections, sectionTitles } from '../../config/constants';
<% } -%>


function routerFactory(options) {

  let router = express.Router();
<% if (use.serverRender) { -%>
  const templatesPath = '../../templates/';
  const mainNavPath = path.resolve(__dirname, path.join(templatesPath, '_main-nav.pug'));
<% } -%>

  function getSection(req, res, next) {
    const section = req.params.section;

    const params = {
      title: options.title,
      section,
    };

<% if (use.serverRender) { -%>
    const pageMeatPath = path.resolve(__dirname, path.join(templatesPath, 'sections', section + '.pug'));
    params.mainNav = pug.renderFile(mainNavPath, params);
    params.pageMeat = pug.renderFile(pageMeatPath, params);
    params.allSections = allSections;
    params.sectionTitles = sectionTitles;
<% } -%>

    res.render('index', params);
    next();
  }


  router.get('/section/:section/', getSection);

  router.get('/', function(req, res) {
    res.redirect('/section/home/');
  });


  return router;
}


export default routerFactory;
