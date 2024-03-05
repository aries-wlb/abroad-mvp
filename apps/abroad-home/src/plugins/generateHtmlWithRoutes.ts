import fs from 'node:fs'
import path from 'node:path'

// 暂时手动维护一份路由表
const routes = [
  {
    path: 'basic-data',
    children: [
      { path: 'equip-manage' },
      { path: 'bom-manage' },
    ],
  },
  {
    path: 'daily-work',
    children: [
      { path: 'daily-work' },
    ],
  },
]
interface Options {
  outDir?: string
}
/*
* options: 目前仅支持 outDir 配置
* */
export default function generateHtmlWithRoutes(options: Options = {}) {
  const outputDir = options.outDir || 'dist'
  return {
    name: 'generateHtmlWithRoutes',
    apply: 'build' as any,
    writeBundle() {
      const sourceFile = path.join(outputDir, 'index.html')
      const makeDir = (url: string) => fs.mkdirSync(url, { recursive: true })
      const cpHtml = (target: string) => fs.copyFile(
        sourceFile,
        target,
        (err) => {
          if (err)
            throw err
        })
      // 按路由表生成文件夹并复制 html
      for (const m of routes) {
        if (m.children) {
          for (const m2 of m.children) {
            makeDir(path.join(outputDir, m.path, m2.path))
            cpHtml(path.join(outputDir, m.path, m2.path, 'index.html'))
          }
        }
        else {
          makeDir(path.join(outputDir, m.path))
          cpHtml(path.join(outputDir, m.path, 'index.html'))
        }
      }
    },
  }
}
