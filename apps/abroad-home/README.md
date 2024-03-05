### 创建项目
> https://cn.vitejs.dev/guide/
`pnpm create vite`

### 配置eslint
> https://github.com/antfu/eslint-config
`pnpm add -D @antfu/eslint-config`
- 修改 eslintrc

```cjs
module.exports = {
  extends: '@antfu',
  parserOptions: {
  // ...
  // project: true,
  },
// ...
}
```
- 安装 eslint 插件，vscode配置
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll": true
  },
}
```

### 路由
> https://reactrouter.com/en/main/start/tutorial
`pnpm add react-router-dom`
- 创建router
```tsx
export const router = createHashRouter([
  {
    path: '/',
    element: <div>MainLayout <Outlet/></div>,
    children: [
      {
        path: '11',
        children: [
          { path: '22', element: <>22</> },
          { path: '33', element: <>33</> },
        ],
      },
    ],
  },
])
```
- 引入 router
``` tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
```

### less
`pnpm add less`

### alias
`pnpm add -D @types/node`
```json
// tsconfig.json
"baseUrl": ".",
"paths": {
  "@/*": ["src/*"]
},
```
```ts
resolve: {
  alias: { '@': path.resolve(__dirname, './src/') },
},
```

### vite plugin
平台要求前端打包产物要根据路由结构生成文件夹及 index.html
可以用脚本做，也可以自己写一个 vite 插件，在 writeBundle 时运行，读取路由列表，利用 node 生成各路由的 html 文件
```json
// tsconfig.node.json
"include": ["vite.config.ts", "src/plugins/*"]
```
```ts
// vite.config.ts
plugins: [react(), generateHtmlWithRoutes()],
```
```ts
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
```

### antd
`pnpm add antd`
`pnpm add @ant-design/pro-components`

### axios 封装
`pnpm add axios`
主要对于请求拦截（权限请求头）、响应拦截（导出excel）、请求方法（GET，POST）、错误处理等功能进行封装

### tailwindcss
> https://tailwindcss.com/docs/guides/vite
`pnpm add -D tailwindcss postcss autoprefixer`
`npx tailwindcss init -p`
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
```less
@tailwind base;
@tailwind components;
@tailwind utilities;
```
- 安装vscode插件 bradlc.vscode-tailwindcss
- 解决 less 报错：Unknown at rule @tailwindless(unknownAtRules)
setting 搜索 unknown
找到 LESS>Lint: Unknown At Rules，设置为 ignore 即可

- 解决 Button 背景透明的 bug
因为 tailwind css button 默认是背景透明的
```js
// tailwind.config.js
corePlugins: {
  preflight: false,
},
```

### zustand
> https://github.com/pmndrs/zustand
`pnpm add zustand`

### snippets
ctrl shift p 搜索 snippet 选择 configure user snippets 选择 typescriptreact
```json
{
	"Initialize TSX Component": {
		"prefix": "tsx",
		"body": [
			"interface Props {}",
			"",
			"export const $1: React.FC<Props> = () => {",
  		"  return <div>$1</div>",
			"}"
		]
	}
}
```

### 远程部署脚本
```bat
:: 设置编码格式为utf-8 否则中文乱码
chcp 65001
:: 关闭命令回显，禁止显示批处理脚本中的命令在执行时的输出，使输出更简洁
@echo off

:: 读取密码，保存至password变量中
set /p password=<.\bin\password.txt

:: net use 基于 SMB 协议，用于在本地系统与远程 windows 系统之间进行文件共享和访问
:: 指定用户名、密码、远程服务器 ip 及共享驱动器，使用 net use 进行远程连接
net use \\10.30.20.87\C$ /user:administrator %password%

:: 清空目标文件夹下所有内容 /s 表示递归地删除指定路径下所有子文件夹中的文件 /q 表示静默（无法找到，确认删除）
:: del /s /q "\\10.30.20.87\C$\ADP\bap-server\bap-workspace\bap-static\_scmbps\_test3\*"
rd /s /q "\\10.30.20.87\C$\ADP\bap-server\bap-workspace\bap-static\_scmbps" 
:: mkdir "\\10.30.20.87\C$\ADP\bap-server\bap-workspace\bap-static\_scmbps\_test9\" 
:: 复制源文件夹下所有内容到目标文件夹 /s 表示递归地复制源文件夹中的所有子文件夹和文件 
:: /e 表示包括空文件夹 /i 表示如果目标是一个目录或包含通配符，则认为它是一个目录 /y 表示自动确认（覆盖）
xcopy /s /e /i /y ".\dist" "\\10.30.20.87\C$\ADP\bap-server\bap-workspace\bap-static\_scmbps"

:: 断开连接
net use \\10.30.20.87\C$ /delete
```

### 安装依赖
`pnpm install --frozen-lockfile`
防止更新时修改lock文件
报错说明pnpm版本不匹配
