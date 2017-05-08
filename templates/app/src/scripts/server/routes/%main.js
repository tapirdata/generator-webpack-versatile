import express from 'express';
<% if (use.serverRender) { -%>
import path from 'path';
import pug from 'pug';
<% } -%>
import { allSections, sectionTitles } from '../../config/constants';


function routerFactory(options) {

  let router = express.Router();
<% if (use.serverRender) { -%>
  const templatesPath = '../../templates/';
  const mainNavPath = path.resolve(__dirname, path.join(templatesPath, '_main-nav.pug'));
  const footerPath = path.resolve(__dirname, path.join(templatesPath, '_footer.pug'));
<% } -%>

  function getSection(req, res, next) {
    const section = req.params.section;

    const params = {
      constants: {
        title: options.title,
        allSections,
        sectionTitles,
      },
      section,
      parts: {},
      linkingMode: 'server',
    };

<% if (use.serverRender) { -%>
    const pageMeatPath = path.resolve(__dirname, path.join(templatesPath, 'sections', section + '.pug'));
    params.parts = {
      mainNav: pug.renderFile(mainNavPath, params),
      pageMeat: pug.renderFile(pageMeatPath, params),
      footer:  pug.renderFile(footerPath, params),
    };

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
