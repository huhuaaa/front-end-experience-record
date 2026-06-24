import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import JsonFormatter from './pages/JsonFormatter'
import Base64Tool from './pages/Base64Tool'
import TimestampTool from './pages/TimestampTool'
import PasswordGenerator from './pages/PasswordGenerator'
import WatermarkTool from './pages/WatermarkTool'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="tools/json-formatter" element={<JsonFormatter />} />
        <Route path="tools/base64" element={<Base64Tool />} />
        <Route path="tools/timestamp" element={<TimestampTool />} />
        <Route path="tools/password-generator" element={<PasswordGenerator />} />
        <Route path="tools/watermark" element={<WatermarkTool />} />
      </Route>
    </Routes>
  )
}
