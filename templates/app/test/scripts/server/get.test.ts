import fetch from "node-fetch"
import { Response } from "node-fetch"
import chai = require("chai")
// tslint:disable-next-line:no-var-requires
const validator = require("html-validator")

import setupFactory from "./setup"
const { expect } = chai

const defaultOptions = setupFactory()

function check(url: string) {
  let res: Response
  let text: string
  it("should answer to a request", async () => {
    res = await fetch(url)
  })
  it("should serve the root page", () =>
    expect(res.status).to.be.equal(200),
  )
  it("should serve some sort of HTML", async () => {
    text = await res.text()
    expect(text).to.contain("<html>")
  })
  return it("should serve valid HTML5", async function() {
    this.timeout(16000)
    const opts = {
      data: text,
    }
    validator(opts, (err?: Error, resultJson?: string) => {
      if (err) {
        throw new Error(`Failed to validate html: ${err}`)
      }
      const result = JSON.parse(resultJson)
      const lines = []
      for (const message of result.messages) {
        if (message.type === "info") {
          continue
        }
        lines.push(`[${message.type}] ${message.message} @line ${message.lastLine} column ${message.lastColumn}:`)
        for (const extractLine of message.extract.split("\n")) {
          lines.push(`| ${extractLine}`)
        }
        lines.push("")
      }
      if (lines.length > 0) {
        throw new Error(`Bad html at '${url}'\n` + lines.join("\n"))
      }
    })
  })
}

describe("The Server", () => {
  check(`http://localhost:${defaultOptions.app.port}/`)
})
