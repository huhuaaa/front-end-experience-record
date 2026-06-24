import {
  LayoutDashboard,
  Braces,
  Binary,
  Clock,
  Image,
  Key,
} from 'lucide-react'

export const tools = [
  { path: '/', label: '首页', icon: LayoutDashboard, exact: true },
  { path: '/tools/json-formatter', label: 'JSON 格式化', icon: Braces },
  { path: '/tools/base64', label: 'Base64 编解码', icon: Binary },
  { path: '/tools/timestamp', label: '时间戳转换', icon: Clock },
  { path: '/tools/password-generator', label: '密码生成器', icon: Key },
  { path: '/tools/watermark', label: '图片打水印', icon: Image },
]
