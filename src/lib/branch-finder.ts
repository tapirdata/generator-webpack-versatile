import fs = require("fs")
import minimatch = require("minimatch")
import path = require("path")

export type TransFn = (s: string) => string

export interface Transformer {
  src: string,
  tgt: string,
  fn?: TransFn,
}

type Op = (srcPath: string, tgtPath: string, transFns?: TransFn[]) => any

export default class BranchFinder {

  protected srcBase: string
  protected tgtBase: string
  protected pattern: string
  protected branches: {[name: string]: boolean}
  protected reBranch: RegExp
  protected op: Op
  protected tgtRelalative: string
  protected transformers: Transformer[]

  constructor(srcBase: string, tgtBase: string, options: any = {}) {
    this.srcBase = srcBase
    this.tgtBase = tgtBase
    this.pattern = options.pattern || "**/*"
    this.branches = options.branches || {}
    this.reBranch = options.reBranch || /^\.if-(\w+)(-no)?$/
    this.op = options.op || this.dummyOp.bind(this)
    this.tgtRelalative = options.tgtRelalative || ""
    this.transformers = options.transformers || []
  }

  public run(src: string = "", tgt: string = "") {
    const names = fs.readdirSync(path.join(this.srcBase, src))
    for (const srcName of names) {
      const srcNext = path.join(src, srcName)
      const srcPath = path.join(this.srcBase, srcNext)
      const srcStat = fs.statSync(srcPath)
      if (srcStat.isFile()) {
        if (srcName === ".unsupported") {
          const msg = fs.readFileSync(srcPath, "utf8")
          throw new Error(msg)
        }
        const ti = this.getTi(srcName)
        const { tgtName } = ti
        // console.log '%s -> %s', srcName, tgtName
        const tgtOk = minimatch(path.join(tgt, tgtName), this.pattern, {dot: true})
        if (tgtOk) {
          const tgtPath = path.join(this.tgtBase, path.relative(this.tgtRelalative, tgt), tgtName)
          this.op(srcPath, tgtPath, ti.transFns)
        }
      } else if (srcStat.isDirectory()) {
        const m = srcName.match(this.reBranch)
        if (m) {
          const setName = m[1]
          const setNot = m[2]
          if (!!this.branches[setName] === !setNot) {
            this.run(srcNext, tgt)
          }
        } else {
          this.run(srcNext, path.join(tgt, srcName))
        }
      }
    }
  }

  public dummyOp(srcPath: string, tgtPath: string) {
    // tslint:disable-next-line:no-console
    console.log("op", srcPath, "->", tgtPath)
  }

  private getTi(srcName: string) {
    let tgtName = srcName
    const transFns: TransFn[] = []
    for (const transformer of this.transformers) {
      if (tgtName.match(transformer.src)) {
        tgtName = srcName.replace(transformer.src, transformer.tgt)
        if (transformer.fn) {
          transFns.push(transformer.fn)
        }
        srcName = tgtName
      }
    }
    return {
      tgtName,
      transFns,
    }
  }
}
