# Tools App Design

## Overview

在 `demo/tools/` 下构建一个基于 Vite + React + TailwindCSS 的工具应用，承载各类小工具。

## Tech Stack

- Vite 作为构建工具
- React 19 + React Router v7（路由）
- TailwindCSS 4（样式）
- lucide-react（图标）

## Layout

```
┌──────────────────────────────────────────────┐
│  Header（顶部栏）                              │
│  [折叠按钮] [Logo/标题]        [工具按钮区]     │
├─────────┬────────────────────────────────────┤
│ Sidebar │                                    │
│ (可折叠) │        Content Area                │
│         │     <Outlet /> （路由出口）          │
└─────────┴────────────────────────────────────┘
```

- **Header**: 固定顶部，左侧折叠按钮 + 应用标题，右侧预留操作区
- **Sidebar**: 展开 240px，收起 64px，transition-all duration-300
- **Content**: `<Outlet />` 自适应剩余宽度

## Routes

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 工具导航卡片 |
| `/tools/json-formatter` | JsonFormatter | JSON 格式化 |
| `/tools/base64` | Base64Tool | Base64 编解码 |
| `/tools/timestamp` | TimestampTool | 时间戳转换 |
| `/tools/watermark` | WatermarkTool | 图片打水印 |

## Directory

```
demo/tools/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles/index.css
│   ├── layouts/MainLayout.jsx
│   ├── components/Header.jsx
│   ├── components/Sidebar.jsx
│   ├── pages/Home.jsx
│   ├── pages/JsonFormatter.jsx
│   ├── pages/Base64Tool.jsx
│   ├── pages/TimestampTool.jsx
│   ├── pages/WatermarkTool.jsx
│   └── config/tools.js
```

## Watermark Tool

- 上传图片 → Canvas 预览
- 输入水印文字，调整位置、透明度、字号、颜色
- 下载带水印的图片
