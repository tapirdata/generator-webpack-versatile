/* global window */

import $ = require("jquery")
import chai = require("chai")

export type TargetFunction = (...args: any[]) => any
export type WrappedFunction = (...args: any[]) => Promise<any>
export type TagFilter = (tag: any) => boolean

function lift(fn: TargetFunction) {
  return async (...args: any[]) => {
    return fn(...args)
  }
}

import { wrapDeferred } from "../../../src/scripts/client/helpers"

class Gasper {

  public app: any
  private headFilter?: TagFilter
  private bodyFilter?: TagFilter

  constructor(options: any = {}) {
    this.headFilter = options.headFilter
    this.bodyFilter = options.bodyFilter
    this.app = null
  }

  public splitHtml(html: string) {
    html = html
      .replace(/<(html|head|body)>/g, '<div class="_$1_">')
      .replace(/<\/(html|head|body)>/g, "</div>")
    const $html = $(html)
    return {
      $head: $html.find("div._head_"),
      $body: $html.find("div._body_"),
    }
  }

  public gaspHtml(html: string) {
    const hs = this.splitHtml(html)

    $("head").html("")
    $("body").html("")
    {
      const filter = this.headFilter
      hs.$head.children().each(function() {
        const $this = $(this)
        if (!filter || filter($this)) {
          $("head").append($this)
        }
      })
    }
    {
      const filter = this.bodyFilter
      hs.$body.children().each(function() {
        const $this = $(this)
        if (!filter || filter($this)) {
          $("body").append($this)
        }
      })
    }
  }

  public async show(location: string) {
    if (location[0] === "#") {
      (window as any).location = location
    } else {
      const html = await wrapDeferred($.get(location)) as string
      this.gaspHtml(html)
      const { app } = this
      if (app) {
        await app.amendPage()
        await app.instrumentPage()
      }
    }
  }

  public async delay(duration: number) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, duration)
    })
  }

  public async activate($a: JQuery<HTMLElement>) {
    if ($a.data("linking") === "client") {
      $a[0].click()
    } else {
      await this.show($a.attr("href") as string)
    }
  }

  public async retry(fn: TargetFunction, grace: number = 1000, steps: number = 10) {

    const delay = this.delay

    async function _retry(wrappedFn: WrappedFunction, dt: number, left: number): Promise<any> {
      let result = wrappedFn()
      if (left > 0) {
        result = result.catch(async () => {
          await delay(dt)
          return _retry(wrappedFn, dt, left - 1)
        })
      }
      return result
    }
    return _retry(lift(fn), grace / steps, steps)
  }

}

export default Gasper
