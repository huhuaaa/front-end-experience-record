# Tools App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `demo/tools/` 下搭建 Vite + React + TailwindCSS 工具应用，包含通用布局框架和图片打水印工具。

**Architecture:** React Router v7 嵌套路由，MainLayout（Header + Sidebar + Outlet）作为根布局，每个工具一个独立页面组件。

**Tech Stack:** Vite, React 19, React Router v7, TailwindCSS 4, lucide-react

## Global Constraints

- 项目目录：`demo/tools/`
- 复用根目录 `node_modules`，不单独安装依赖（通过 package.json scripts 运行）
- 侧边栏可折叠，折叠状态持久化到 localStorage
- 每个工具独立路由页面
- 图片打水印工具需立即实现

---

### Task 1: 项目脚手架

**Files:**
- Create: `demo/tools/index.html`
- Create: `demo/tools/vite.config.js`
- Create: `demo/tools/package.json`
- Create: `demo/tools/src/main.jsx`
- Create: `demo/tools/src/App.jsx`
- Create: `demo/tools/src/styles/index.css`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "tools-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

- [ ] **Step 2: 创建 vite.config.js**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' }
  }
})
```

- [ ] **Step 3: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>工具箱</title>
</head>
<body class="bg-gray-50 text-gray-900">
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

- [ ] **Step 4: 创建 src/styles/index.css**

```css
@import "tailwindcss";
```

- [ ] **Step 5: 创建 src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

- [ ] **Step 6: 创建 src/App.jsx**

```jsx
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import JsonFormatter from './pages/JsonFormatter'
import Base64Tool from './pages/Base64Tool'
import TimestampTool from './pages/TimestampTool'
import WatermarkTool from './pages/WatermarkTool'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="tools/json-formatter" element={<JsonFormatter />} />
        <Route path="tools/base64" element={<Base64Tool />} />
        <Route path="tools/timestamp" element={<TimestampTool />} />
        <Route path="tools/watermark" element={<WatermarkTool />} />
      </Route>
    </Routes>
  )
}
```

- [ ] **Step 7: Commit**

---

### Task 2: 工具菜单配置

**Files:**
- Create: `demo/tools/src/config/tools.js`

- [ ] **Step 1: 创建 tools.js 注册表**

```javascript
import {
  LayoutDashboard,
  Braces,
  Binary,
  Clock,
  Image,
} from 'lucide-react'

export const tools = [
  { path: '/', label: '首页', icon: LayoutDashboard, exact: true },
  { path: '/tools/json-formatter', label: 'JSON 格式化', icon: Braces },
  { path: '/tools/base64', label: 'Base64 编解码', icon: Binary },
  { path: '/tools/timestamp', label: '时间戳转换', icon: Clock },
  { path: '/tools/watermark', label: '图片打水印', icon: Image },
]
```

- [ ] **Step 2: Commit**

---

### Task 3: Header 组件

**Files:**
- Create: `demo/tools/src/components/Header.jsx`

- [ ] **Step 1: 创建 Header 组件**

```jsx
import { MenuFoldOutlined, MenuUnfoldOutlined, Wrench } from 'lucide-react'

export default function Header({ collapsed, onToggle }) {
  return (
    <header className="h-14 flex items-center justify-between px-4 bg-white border-b border-gray-200 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          title={collapsed ? '展开菜单' : '收起菜单'}
        >
          {collapsed ? <MenuUnfoldOutlined size={20} /> : <MenuFoldOutlined size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <Wrench size={20} className="text-blue-500" />
          <span className="font-semibold text-base">工具箱</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/* 预留操作按钮区 */}
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Commit**

---

### Task 4: Sidebar 组件

**Files:**
- Create: `demo/tools/src/components/Sidebar.jsx`

- [ ] **Step 1: 创建 Sidebar 组件**

```jsx
import { NavLink } from 'react-router-dom'
import { tools } from '../config/tools'

export default function Sidebar({ collapsed }) {
  return (
    <aside
      className={`shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <nav className="flex-1 py-2">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <NavLink
              key={tool.path}
              to={tool.path}
              end={tool.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors text-sm whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
              title={collapsed ? tool.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{tool.label}</span>}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
```

- [ ] **Step 2: Commit**

---

### Task 5: MainLayout 布局

**Files:**
- Create: `demo/tools/src/layouts/MainLayout.jsx`

- [ ] **Step 1: 创建 MainLayout**

```jsx
import { useState, useEffect, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

const STORAGE_KEY = 'tools-sidebar-collapsed'

function getInitialCollapsed() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'true'
  } catch {
    return false
  }
}

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(getInitialCollapsed)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed))
  }, [collapsed])

  const toggle = useCallback(() => setCollapsed((v) => !v), [])

  return (
    <div className="h-screen flex flex-col">
      <Header collapsed={collapsed} onToggle={toggle} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={collapsed} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

---

### Task 6: 首页 Home 页面

**Files:**
- Create: `demo/tools/src/pages/Home.jsx`

- [ ] **Step 1: 创建 Home 页面**

```jsx
import { Link } from 'react-router-dom'
import { tools } from '../config/tools'

export default function Home() {
  const toolList = tools.filter((t) => !t.exact)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">🛠️ 工具导航</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {toolList.map((tool) => {
          const Icon = tool.icon
          return (
            <Link
              key={tool.path}
              to={tool.path}
              className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                <Icon size={24} />
              </div>
              <span className="font-medium text-gray-700">{tool.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

---

### Task 7: 占位工具页面

**Files:**
- Create: `demo/tools/src/pages/JsonFormatter.jsx`
- Create: `demo/tools/src/pages/Base64Tool.jsx`
- Create: `demo/tools/src/pages/TimestampTool.jsx`

- [ ] **Step 1: 创建三个占位页面**

JsonFormatter.jsx:
```jsx
export default function JsonFormatter() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">JSON 格式化</h1>
      <p className="text-gray-400">即将上线…</p>
    </div>
  )
}
```

Base64Tool.jsx:
```jsx
export default function Base64Tool() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Base64 编解码</h1>
      <p className="text-gray-400">即将上线…</p>
    </div>
  )
}
```

TimestampTool.jsx:
```jsx
export default function TimestampTool() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">时间戳转换</h1>
      <p className="text-gray-400">即将上线…</p>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

---

### Task 8: 图片打水印工具

**Files:**
- Create: `demo/tools/src/pages/WatermarkTool.jsx`

- [ ] **Step 1: 创建 WatermarkTool 页面**

```jsx
import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, Download, RotateCcw } from 'lucide-react'

const DEFAULT_TEXT = '水印文字'

export default function WatermarkTool() {
  const [image, setImage] = useState(null)
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 })
  const [text, setText] = useState(DEFAULT_TEXT)
  const [fontSize, setFontSize] = useState(48)
  const [opacity, setOpacity] = useState(0.3)
  const [color, setColor] = useState('#ffffff')
  const [position, setPosition] = useState('center')
  const [previewUrl, setPreviewUrl] = useState(null)
  const canvasRef = useRef(null)
  const imageRef = useRef(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const img = imageRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight

    // draw original image
    ctx.drawImage(img, 0, 0)

    // watermark style
    ctx.font = `${fontSize}px sans-serif`
    ctx.fillStyle = color
    ctx.globalAlpha = opacity
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const metrics = ctx.measureText(text)
    const textWidth = metrics.width
    const textHeight = fontSize

    // calculate position
    let x, y
    const pad = 40
    switch (position) {
      case 'top-left':
        x = pad + textWidth / 2
        y = pad + textHeight / 2
        break
      case 'top-right':
        x = canvas.width - pad - textWidth / 2
        y = pad + textHeight / 2
        break
      case 'bottom-left':
        x = pad + textWidth / 2
        y = canvas.height - pad - textHeight / 2
        break
      case 'bottom-right':
        x = canvas.width - pad - textWidth / 2
        y = canvas.height - pad - textHeight / 2
        break
      case 'tiled':
        ctx.globalAlpha = opacity
        for (let cy = 0; cy < canvas.height; cy += textHeight * 3) {
          for (let cx = 0; cx < canvas.width; cx += textWidth * 2) {
            ctx.save()
            ctx.translate(cx + textWidth, cy + textHeight)
            ctx.rotate((-30 * Math.PI) / 180)
            ctx.fillText(text, 0, 0)
            ctx.restore()
          }
        }
        setPreviewUrl(canvas.toDataURL('image/png'))
        return
      default: // center
        x = canvas.width / 2
        y = canvas.height / 2
    }

    ctx.fillText(text, x, y)
    setPreviewUrl(canvas.toDataURL('image/png'))
  }, [text, fontSize, opacity, color, position])

  useEffect(() => {
    draw()
  }, [draw, image])

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      imageRef.current = img
      setImage(url)
      setImageSize({ w: img.naturalWidth, h: img.naturalHeight })
      setPreviewUrl(null)
    }
    img.src = url
  }

  const handleDownload = () => {
    if (!previewUrl) return
    const link = document.createElement('a')
    link.download = 'watermarked.png'
    link.href = previewUrl
    link.click()
  }

  const handleReset = () => {
    setImage(null)
    setImageSize({ w: 0, h: 0 })
    setPreviewUrl(null)
    imageRef.current = null
    setText(DEFAULT_TEXT)
    setFontSize(48)
    setOpacity(0.3)
    setColor('#ffffff')
    setPosition('center')
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">🖼️ 图片打水印</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* controls */}
        <div className="w-full lg:w-72 shrink-0 space-y-4">
          {/* upload */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">上传图片</label>
            <label className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer transition-colors text-sm text-gray-500">
              <Upload size={16} />
              {image ? '更换图片' : '选择图片'}
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
            {image && (
              <p className="text-xs text-gray-400 mt-1">
                尺寸: {imageSize.w} × {imageSize.h}
              </p>
            )}
          </div>

          {/* text */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">水印文字</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* fontSize */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              字号: {fontSize}px
            </label>
            <input
              type="range"
              min={12}
              max={200}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          {/* opacity */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              透明度: {Math.round(opacity * 100)}%
            </label>
            <input
              type="range"
              min={5}
              max={100}
              value={Math.round(opacity * 100)}
              onChange={(e) => setOpacity(Number(e.target.value) / 100)}
              className="w-full accent-blue-500"
            />
          </div>

          {/* color */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">颜色</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border-0"
            />
          </div>

          {/* position */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">位置</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="center">居中</option>
              <option value="top-left">左上</option>
              <option value="top-right">右上</option>
              <option value="bottom-left">左下</option>
              <option value="bottom-right">右下</option>
              <option value="tiled">平铺</option>
            </select>
          </div>

          {/* actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleDownload}
              disabled={!previewUrl}
              className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Download size={16} />
              下载
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={16} />
              重置
            </button>
          </div>
        </div>

        {/* preview */}
        <div className="flex-1 min-h-[400px] bg-white rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
          {!image ? (
            <div className="text-gray-300 text-sm">请先上传一张图片</div>
          ) : (
            <div className="p-4">
              <canvas ref={canvasRef} className="max-w-full max-h-[70vh] object-contain border" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

---

### Task 9: 安装依赖 & 启动验证

- [ ] **Step 1: 安装项目依赖**

```bash
cd demo/tools && npm install
```

- [ ] **Step 2: 启动开发服务器验证**

```bash
cd demo/tools && npm run dev
```

验证：
1. 页面正常渲染，顶部栏 + 侧边栏 + 内容区三部分布局
2. 侧边栏折叠/展开正常，刷新后记忆状态
3. 路由切换正常，浏览器前进后退可用
4. 打水印工具：上传图片 → 调整参数 → Canvas 预览 → 下载正常

- [ ] **Step 3: Commit**
