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
