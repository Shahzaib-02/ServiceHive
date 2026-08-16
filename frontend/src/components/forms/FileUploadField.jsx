// import React from 'react'
// import { Upload } from 'lucide-react'

// const FileUploadField = ({
//   label,
//   accept,
//   file,
//   error = '',
//   onChange,
//   required = false,
// }) => (
//   <div className="space-y-2">
//     <label className="block text-sm font-medium text-slate-200">
//       {label}
//       {required ? <span className="ml-1 text-rose-400">*</span> : null}
//     </label>
//     <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed px-4 py-4 transition ${error ? 'border-rose-400/60 bg-rose-400/5' : 'border-white/15 bg-white/5 hover:bg-white/8'}`}>
//       <div className="rounded-2xl border border-white/10 bg-white/8 p-3">
//         <Upload className="h-4 w-4 text-cyan-200" />
//       </div>
//       <div className="flex-1">
//         <p className="text-sm font-medium text-white">{file?.name || 'Upload file'}</p>
//         <p className="text-xs text-slate-400">Accepted: {accept}</p>
//       </div>
//       <input
//         type="file"
//         accept={accept}
//         className="hidden"
//         onChange={(event) => onChange(event.target.files?.[0] || null)}
//       />
//     </label>
//     {error ? <p className="text-sm text-rose-400">{error}</p> : null}
//   </div>
// )

// export default FileUploadField






// forms/FileUploadField.jsx

import { useState, useRef } from 'react'

const FileUploadField = ({ label, accept, maxSize, onChange }) => {
  const [fileName, setFileName] = useState(null)
  const [error, setError] = useState(null)
  const inputRef = useRef()

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (maxSize && file.size > maxSize) {
      setError(`File too large. Max size is ${Math.round(maxSize / 1024 / 1024)}MB`)
      setFileName(null)
      return
    }

    setError(null)
    setFileName(file.name)   // 👈 store the name to display
    onChange?.(file)
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}

      <div
        className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-slate-600 cursor-pointer hover:border-slate-400 transition-colors"
        onClick={() => inputRef.current.click()}
      >
        {/* icon */}
        <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
          </svg>
        </div>

        {/* text */}
        <div>
          {fileName ? (
            <>
              <p className="text-sm font-medium text-white">{fileName}</p>       
              <p className="text-xs text-slate-400 mt-0.5">Click to change</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-white">Upload file</p>
              <p className="text-xs text-slate-400 mt-0.5">Accepted: {accept}</p>
            </>
          )}
        </div>

        {/* clear button — only show when file selected */}
        {fileName && (
          <button
            type="button"
            className="ml-auto text-slate-400 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation()   // 👈 don't re-open file picker
              setFileName(null)
              onChange?.(null)
              inputRef.current.value = ''
            }}
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}

export default FileUploadField