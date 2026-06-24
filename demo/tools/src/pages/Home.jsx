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
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 shrink-0">
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
