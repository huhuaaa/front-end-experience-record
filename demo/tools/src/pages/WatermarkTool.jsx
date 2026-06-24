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
    ctx.font = `${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`
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
  }, [draw])

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
    if (image) URL.revokeObjectURL(image)
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
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
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
              className="w-10 h-10 rounded cursor-pointer border border-gray-200"
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
            <div className="text-gray-300 text-sm flex flex-col items-center gap-2">
              <Upload size={40} className="opacity-30" />
              <span>请先上传一张图片</span>
            </div>
          ) : (
            <div className="p-4 w-full flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[70vh] object-contain rounded shadow-sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
