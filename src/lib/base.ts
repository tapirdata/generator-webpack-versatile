import path = require("path")
import Generator = require("yeoman-generator")

import BranchFinder from "./branch-finder"
import { TransFn } from "./branch-finder"

export interface Answers {
  framework: string
  frontend: string
  features: string[]
}

export default class BaseGenerator extends Generator {

  protected _copyOp(srcPath: string, tgtPath: string, transFns?: TransFn[]) {
    const copyOptions: any = {}
    if (transFns && transFns.length) {
      copyOptions.process = (contents: any) => {
        let s = contents.toString()
        for (const transFn of transFns) {
          s = transFn(s)
        }
        return s
      }
    }
    this.fs.copy(srcPath, tgtPath, copyOptions)
  }

  protected _branchCopy(opt: any) {
    const source = opt.source
    const tgtBase = opt.target || ""
    const transformers = opt.transformers || []
    const pattern = opt.pattern || "**/*"
    const branches = opt.branches || {}
    const srcBase = this.sourceRoot()
    const options = {
      pattern: path.join(source, pattern),
      tgtRelalative: source,
      branches,
      transformers,
      op: this._copyOp.bind(this),
    }
    const bf = new BranchFinder(srcBase, tgtBase, options)
    bf.run()
  }

}
