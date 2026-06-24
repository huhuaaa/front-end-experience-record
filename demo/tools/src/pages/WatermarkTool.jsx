import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, Download, RotateCcw, Plus, Trash2, FlipHorizontal, FlipVertical } from 'lucide-react'

const DEFAULT_TEXT = '水印文字'
const FONT_FAMILY = '"PingFang SC", "Microsoft YaHei", sans-serif'

let nextId = 1
function createWm(overrides = {}) {
  return {
    id: nextId++,
    text: DEFAULT_TEXT,
    x: 0,
    y: 0,
    fontSize: 48,
    opacity: 0.3,
    color: '#ffffff',
    rotation: 0,
    flipH: false,
    flipV: false,
    ...overrides,
  }
}

export default function WatermarkTool() {
  const [image, setImage] = useState(null)
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 })
  const [watermarks, setWatermarks] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [draggingId, setDraggingId] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const draggingIdRef = useRef(null) // 避免 mousemove 闭包陈旧

  // ---- Drawing ----

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const img = imageRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    ctx.drawImage(img, 0, 0)

    for (const wm of watermarks) {
      ctx.save()
      ctx.translate(wm.x, wm.y)
      ctx.rotate((wm.rotation * Math.PI) / 180)
      ctx.scale(wm.flipH ? -1 : 1, wm.flipV ? -1 : 1)
      ctx.font = `${wm.fontSize}px ${FONT_FAMILY}`
      ctx.fillStyle = wm.color
      ctx.globalAlpha = wm.opacity
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(wm.text, 0, 0)
      ctx.restore()
    }

    setPreviewUrl(canvas.toDataURL('image/png'))
  }, [watermarks])

  useEffect(() => {
    if (image) {
      requestAnimationFrame(() => draw())
    }
  }, [image, draw])

  // ---- 坐标转换 & 命中检测 ----

  function canvasCoords(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  function hitTest(canvas, wm, cx, cy) {
    const ctx = canvas.getContext('2d')
    // inverse-transform the click point into watermark-local space
    const dx = cx - wm.x
    const dy = cy - wm.y
    const angle = (-wm.rotation * Math.PI) / 180
    const localX = dx * Math.cos(angle) - dy * Math.sin(angle)
    const localY = dx * Math.sin(angle) + dy * Math.cos(angle)

    ctx.font = `${wm.fontSize}px ${FONT_FAMILY}`
    const metrics = ctx.measureText(wm.text)
    const halfW = metrics.width / 2 + 8
    const halfH = wm.fontSize / 2 + 8
    return localX >= -halfW && localX <= halfW && localY >= -halfH && localY <= halfH
  }

  // ---- 拖拽事件 ----

  const handleMouseDown = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas || watermarks.length === 0) return

    const { x, y } = canvasCoords(canvas, e.clientX, e.clientY)

    for (let i = watermarks.length - 1; i >= 0; i--) {
      if (hitTest(canvas, watermarks[i], x, y)) {
        draggingIdRef.current = watermarks[i].id
        setDraggingId(watermarks[i].id)
        setSelectedId(watermarks[i].id)
        return
      }
    }
    setSelectedId(null)
  }, [watermarks])

  const handleMouseMove = useCallback((e) => {
    const id = draggingIdRef.current
    if (id == null) return
    const canvas = canvasRef.current
    if (!canvas) return

    const { x, y } = canvasCoords(canvas, e.clientX, e.clientY)
    setWatermarks((prev) => prev.map((wm) => (wm.id === id ? { ...wm, x, y } : wm)))
  }, [])

  const handleMouseUp = useCallback(() => {
    draggingIdRef.current = null
    setDraggingId(null)
  }, [])

  // ---- 上传 / 下载 / 重置 ----

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      imageRef.current = img
      setImage(url)
      setImageSize({ w: img.naturalWidth, h: img.naturalHeight })
      const wm = createWm({
        x: Math.round(img.naturalWidth / 2),
        y: Math.round(img.naturalHeight / 2),
      })
      setWatermarks([wm])
      setSelectedId(wm.id)
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
    if (image) URL.revokeObjectURL(image)
    setImage(null)
    setImageSize({ w: 0, h: 0 })
    setPreviewUrl(null)
    imageRef.current = null
    setWatermarks([])
    setSelectedId(null)
    setDraggingId(null)
    draggingIdRef.current = null
  }

  // ---- 水印操作 ----

  const selectedWm = watermarks.find((w) => w.id === selectedId) || null

  function updateSelected(field, value) {
    if (!selectedId) return
    setWatermarks((prev) => prev.map((w) => (w.id === selectedId ? { ...w, [field]: value } : w)))
  }

  const addWatermark = () => {
    const canvas = canvasRef.current
    const img = imageRef.current
    const cx = img ? Math.round(img.naturalWidth / 2) : 200
    const cy = img ? Math.round(img.naturalHeight / 2) : 200
    const wm = createWm({ x: cx, y: cy })
    setWatermarks((prev) => [...prev, wm])
    setSelectedId(wm.id)
  }

  const removeWatermark = (id) => {
    setWatermarks((prev) => {
      const next = prev.filter((w) => w.id !== id)
      if (id === selectedId) {
        setSelectedId(next.length > 0 ? next[next.length - 1].id : null)
      }
      return next
    })
  }

  // ---- Render ----

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">🖼️ 图片打水印</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ====== 左侧面板 ====== */}
        <div className="w-full lg:w-72 shrink-0 space-y-4">
          {/* 上传 */}
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

          {/* 水印列表 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-600">
                水印列表 ({watermarks.length})
              </span>
              <button
                onClick={addWatermark}
                disabled={!image}
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={14} />
                添加
              </button>
            </div>
            <div className="max-h-44 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
              {watermarks.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-300">暂无水印</div>
              ) : (
                watermarks.map((wm) => (
                  <div
                    key={wm.id}
                    onClick={() => setSelectedId(wm.id)}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors text-sm ${
                      wm.id === selectedId
                        ? 'bg-blue-50 border-l-2 border-blue-500'
                        : 'hover:bg-gray-50 border-l-2 border-transparent'
                    }`}
                  >
                    <span className="truncate flex-1 text-gray-700">{wm.text || '(空)'}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeWatermark(wm.id)
                      }}
                      className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0 ml-2"
                      title="删除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 属性编辑（仅选中时） */}
          {selectedWm && (
            <div className="space-y-3 p-3 rounded-lg border border-gray-200 bg-gray-50/50">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">编辑水印</p>

              {/* 文字 */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">文字</label>
                <input
                  type="text"
                  value={selectedWm.text}
                  onChange={(e) => updateSelected('text', e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>

              {/* 字号 */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  字号: {selectedWm.fontSize}px
                </label>
                <input
                  type="range"
                  min={12}
                  max={200}
                  value={selectedWm.fontSize}
                  onChange={(e) => updateSelected('fontSize', Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* 透明度 */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  透明度: {Math.round(selectedWm.opacity * 100)}%
                </label>
                <input
                  type="range"
                  min={5}
                  max={100}
                  value={Math.round(selectedWm.opacity * 100)}
                  onChange={(e) => updateSelected('opacity', Number(e.target.value) / 100)}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* 颜色 */}
              <div className="flex items-center gap-3">
                <label className="text-xs text-gray-500">颜色</label>
                <input
                  type="color"
                  value={selectedWm.color}
                  onChange={(e) => updateSelected('color', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                />
              </div>

              {/* 旋转 */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  旋转: {selectedWm.rotation}°
                </label>
                <input
                  type="range"
                  min={0}
                  max={359}
                  value={selectedWm.rotation}
                  onChange={(e) => updateSelected('rotation', Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* 翻转 */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 mr-1">翻转</label>
                <button
                  onClick={() => updateSelected('flipH', !selectedWm.flipH)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                    selectedWm.flipH
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  title="水平翻转"
                >
                  <FlipHorizontal size={14} />水平
                </button>
                <button
                  onClick={() => updateSelected('flipV', !selectedWm.flipV)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                    selectedWm.flipV
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  title="垂直翻转"
                >
                  <FlipVertical size={14} />垂直
                </button>
              </div>

              {/* 坐标只读 */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-0.5">X</label>
                  <span className="text-sm text-gray-600 tabular-nums">{Math.round(selectedWm.x)}</span>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-0.5">Y</label>
                  <span className="text-sm text-gray-600 tabular-nums">{Math.round(selectedWm.y)}</span>
                </div>
              </div>
            </div>
          )}

          {/* 操作 */}
          <div className="flex gap-2 pt-1">
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

        {/* ====== 右侧预览区 ====== */}
        <div className="flex-1 min-h-[400px] bg-white rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
          {!image ? (
            <div className="text-gray-300 text-sm flex flex-col items-center gap-2">
              <Upload size={40} className="opacity-30" />
              <span>请先上传一张图片</span>
            </div>
          ) : (
            <div
              className="p-4 w-full flex items-center justify-center"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[70vh] object-contain rounded shadow-sm select-none"
                style={{ cursor: draggingId != null ? 'grabbing' : 'crosshair' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
