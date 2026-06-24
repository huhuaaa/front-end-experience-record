import { useState, useCallback } from 'react'
import { Copy, RefreshCw, Check, ShieldAlert, ShieldCheck, Shield } from 'lucide-react'

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  number: '0123456789',
  symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}
const AMBIGUOUS = 'Il1O0o'

function shuffle(str) {
  const arr = str.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.join('')
}

function getStrength(password) {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z\d]/.test(password)) score++
  if (score <= 2) return { level: 'weak', label: '弱', color: 'text-red-500', bg: 'bg-red-500' }
  if (score <= 4) return { level: 'medium', label: '中', color: 'text-yellow-500', bg: 'bg-yellow-500' }
  return { level: 'strong', label: '强', color: 'text-green-500', bg: 'bg-green-500' }
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    upper: true,
    lower: true,
    number: true,
    symbol: true,
  })
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState([])

  const toggle = (key) =>
    setOptions((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      // 至少保留一种字符类型
      if (Object.values(next).some(Boolean)) return next
      return prev
    })

  const generate = useCallback(() => {
    let pool = ''
    if (options.upper) pool += CHARS.upper
    if (options.lower) pool += CHARS.lower
    if (options.number) pool += CHARS.number
    if (options.symbol) pool += CHARS.symbol

    if (excludeAmbiguous) {
      pool = pool
        .split('')
        .filter((c) => !AMBIGUOUS.includes(c))
        .join('')
    }

    // 保证每种选中类型至少出现一次
    const required = []
    if (options.upper) required.push(CHARS.upper[Math.floor(Math.random() * CHARS.upper.length)])
    if (options.lower) required.push(CHARS.lower[Math.floor(Math.random() * CHARS.lower.length)])
    if (options.number) required.push(CHARS.number[Math.floor(Math.random() * CHARS.number.length)])
    if (options.symbol) required.push(CHARS.symbol[Math.floor(Math.random() * CHARS.symbol.length)])

    const remaining = length - required.length
    const fill = Array.from({ length: remaining }, () => pool[Math.floor(Math.random() * pool.length)])
    const pwd = shuffle(required.join('') + fill.join(''))

    setPassword(pwd)
    setCopied(false)
    setHistory((prev) => {
      const next = [pwd, ...prev.filter((h) => h !== pwd)]
      return next.slice(0, 10)
    })
  }, [length, options, excludeAmbiguous])

  const copy = async () => {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const strength = getStrength(password)
  const StrengthIcon = strength.level === 'weak' ? ShieldAlert : strength.level === 'medium' ? Shield : ShieldCheck

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">🔐 密码生成器</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧配置 */}
        <div className="w-full lg:w-72 shrink-0 space-y-5">
          {/* 长度 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              密码长度: <span className="tabular-nums font-semibold">{length}</span>
            </label>
            <input
              type="range"
              min={6}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>6</span><span>64</span>
            </div>
          </div>

          {/* 字符类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">字符类型</label>
            <div className="space-y-1.5">
              {[
                { key: 'upper', label: '大写字母 A-Z', example: 'ABCD' },
                { key: 'lower', label: '小写字母 a-z', example: 'abcd' },
                { key: 'number', label: '数字 0-9', example: '0123' },
                { key: 'symbol', label: '符号 !@#$…', example: '!@#$' },
              ].map(({ key, label, example }) => (
                <label
                  key={key}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                    options[key]
                      ? 'border-blue-300 bg-blue-50/50 text-gray-800'
                      : 'border-gray-200 text-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={options[key]}
                    onChange={() => toggle(key)}
                    className="accent-blue-500"
                  />
                  <span className="flex-1">{label}</span>
                  <span className="text-xs font-mono opacity-50">{example}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 模糊字符 */}
          <label className="flex items-center gap-2.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="accent-blue-500"
            />
            <span className="text-gray-600">排除易混淆字符</span>
            <span className="text-xs text-gray-400 font-mono">I l 1 O 0 o</span>
          </label>

          {/* 生成按钮 */}
          <button
            onClick={generate}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
          >
            <RefreshCw size={18} />
            生成密码
          </button>
        </div>

        {/* 右侧结果 */}
        <div className="flex-1 space-y-4">
          {/* 密码显示 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            {password ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 font-mono text-xl tracking-wider break-all select-all text-gray-800">
                    {password}
                  </div>
                  <button
                    onClick={copy}
                    className={`shrink-0 p-2 rounded-lg transition-colors ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                    title="复制"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>

                {/* 强度指示 */}
                <div className="flex items-center gap-2">
                  <StrengthIcon size={16} className={strength.color} />
                  <span className={`text-sm font-medium ${strength.color}`}>
                    强度: {strength.label}
                  </span>
                  <div className="flex-1 flex gap-1">
                    {['weak', 'medium', 'strong'].map((lvl) => {
                      const active =
                        lvl === 'weak' ||
                        (lvl === 'medium' && strength.level !== 'weak') ||
                        (lvl === 'strong' && strength.level === 'strong')
                      return (
                        <div
                          key={lvl}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            active ? strength.bg : 'bg-gray-200'
                          }`}
                        />
                      )
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-300 text-sm">
                <RefreshCw size={36} className="mx-auto mb-2 opacity-30" />
                点击「生成密码」开始
              </div>
            )}
          </div>

          {/* 历史记录 */}
          {history.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2">最近生成</p>
              <div className="space-y-1.5">
                {history.map((pwd, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-100 text-sm group"
                  >
                    <span className="flex-1 font-mono text-gray-600 truncate select-all">{pwd}</span>
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(pwd)
                      }}
                      className="shrink-0 p-1 rounded text-gray-300 hover:text-blue-500 hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-all"
                      title="复制"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
