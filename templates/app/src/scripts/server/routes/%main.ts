import express = require("express")
<% if (use.serverRender) { -%>
import path = require("path")
import pug = require("pug")
<% } -%>

import { allSections, sectionTitles } from "../../common/constants"

function routerFactory(options: any) {

  const router = express.Router()
<% if (use.serverRender) { -%>
  const templatesPath = "../../templates/"
  const mainNavPath = path.resolve(__dirname, path.join(templatesPath, "_main-nav.pug"))
  const footerPath = path.resolve(__dirname, path.join(templatesPath, "_footer.pug"))
<% } -%>

  function getSection(req: express.Request, res: express.Response, next: () => void) {
    const section = req.params.section

    const params = {
      constants: {
        title: options.title,
        allSections,
        sectionTitles,
      },
      section,
      parts: {},
      linkingMode: "server",
    }

<% if (use.serverRender) { -%>
    const pageMeatPath = path.resolve(__dirname, path.join(templatesPath, "sections", section + ".pug"))
    params.parts = {
      mainNav: pug.renderFile(mainNavPath, params),
      pageMeat: pug.renderFile(pageMeatPath, params),
      footer:  pug.renderFile(footerPath, params),
    }

<% } -%>
    res.render("index", params)
    next()
  }

  router.get("/section/:section/", getSection)

  router.get("/", (req, res) => {
    res.redirect("/section/home/")
  })

  return router
}

export default routerFactory
