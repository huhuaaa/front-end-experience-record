import { PanelLeftClose, PanelLeft, Wrench } from 'lucide-react'

export default function Header({ collapsed, onToggle }) {
  return (
    <header className="h-14 flex items-center justify-between px-4 bg-white border-b border-gray-200 shrink-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          title={collapsed ? '展开菜单' : '收起菜单'}
        >
          {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
        </button>
        <div className="flex items-center gap-2 select-none">
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
