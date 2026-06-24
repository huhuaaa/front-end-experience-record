import { NavLink } from 'react-router-dom'
import { tools } from '../config/tools'

export default function Sidebar({ collapsed }) {
  return (
    <aside
      className={`shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <nav className="flex-1 py-3">
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
