import React, { useEffect, useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'

const MultiImageUploadField = ({
  label,
  min = 2,
  max = 5,
  files,
  onChange,
  error = '',
  hint = '',
}) => {
  const inputRef = useRef(null)
  const [thumbUrls, setThumbUrls] = useState([])

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f))
    setThumbUrls(urls)
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [files])

  const addFiles = (list) => {
    const picked = Array.from(list || []).filter((f) => f.type.startsWith('image/'))
    if (!picked.length) {
      return
    }
    const next = [...files, ...picked].slice(0, max)
    onChange(next)
  }

  const removeAt = (index) => {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-200">
        {label}
        <span className="ml-1 text-slate-500">
          {min > 0 ? ` (${min}–${max} images)` : ` (up to ${max} more)`}
        </span>
      </label>
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      <div className="flex flex-wrap gap-3">
        {files.map((file, index) => (
          <div key={`${file.name}-${file.lastModified}-${index}`} className="relative h-24 w-24 overflow-hidden rounded-2xl border border-white/15 bg-white/5">
            <img src={thumbUrls[index] || ''} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute right-1 top-1 rounded-lg bg-black/70 p-1 text-white hover:bg-rose-600/90"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {files.length < max ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-white/20 bg-white/5 text-slate-400 transition hover:border-yellow-400 hover:text-yellow-200"
          >
            <ImagePlus className="h-6 w-6" />
            <span className="text-[10px]">Add</span>
          </button>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>
      <p className="text-xs text-slate-500">
        {files.length}
        {' '}
        /
        {max}
        {' '}
        selected
      </p>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </div>
  )
}

export default MultiImageUploadField
