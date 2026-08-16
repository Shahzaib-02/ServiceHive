// import React from 'react'
// import Button from './Button'
// import Card from './Card'
// import Input from './Input'
// import FileUploadField from '../forms/FileUploadField'

// const DashboardProfileEditor = ({
//   workspaceBadge,
//   title,
//   description,
//   nameFieldLabel = 'Full name',
//   submitButtonLabel = 'Save changes',
//   tips = [],
// }) => {
//   return (
//     <div className="space-y-8">
//       <div className="space-y-4">
//         <div className="flex items-center gap-2">
//           <span className="badge-chip">{workspaceBadge}</span>
//           <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-white">{title}</h1>
//         </div>
//         <p className="max-w-2xl text-slate-300">{description}</p>
//       </div>

//       <Card className="p-8" hover={false}>
//         <form className="grid gap-6 sm:grid-cols-2">
//           <Input name="fullName" label={nameFieldLabel} placeholder="Enter your full name" />
//           <Input name="phone" label="Phone number" placeholder="+1 (555) 123-4567" />
//           <Input name="city" label="City" placeholder="New York" />
//           <div className="sm:col-span-2">
//             <FileUploadField
//               label="Profile photo"
//               accept="image/*"
//               maxSize={5 * 1024 * 1024} // 5MB
//             />
//           </div>
//           <div className="sm:col-span-2 flex gap-4">
//             <Button type="submit">{submitButtonLabel}</Button>
//             <Button variant="secondary" type="button">Cancel</Button>
//           </div>
//         </form>
//       </Card>

//       {tips.length > 0 && (
//         <Card className="p-6" hover={false}>
//           <h3 className="text-lg font-semibold text-white mb-4">Tips</h3>
//           <ul className="space-y-2 text-sm text-slate-300">
//             {tips.map((tip, index) => (
//               <li key={index} className="flex items-start gap-2">
//                 <span className="text-cyan-400 mt-1">•</span>
//                 {tip}
//               </li>
//             ))}
//           </ul>
//         </Card>
//       )}
//     </div>
//   )
// }

// export default DashboardProfileEditor



import React, { useEffect, useState } from 'react'
import Button from './Button'
import Card from './Card'
import Input from './Input'
import FileUploadField from '../forms/FileUploadField'

const defaultInitialValues = {
  fullName: '',
  phone: '',
  city: '',
  photo: null,
}

const DashboardProfileEditor = ({
  workspaceBadge,
  title,
  description,
  nameFieldLabel = 'Full name',
  submitButtonLabel = 'Save changes',
  tips = [],
  initialValues = defaultInitialValues,
  onSave,
}) => {
  const [form, setForm] = useState(initialValues)
  const [saved, setSaved] = useState(initialValues)
  const [status, setStatus] = useState(null) // null | 'saving' | 'success' | 'error'

  useEffect(() => {
    setForm(initialValues)
    setSaved(initialValues)
  }, [initialValues])

  const isDirty = Object.keys(form).some((k) => form[k] !== saved[k])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (file) => {
    if (!file) {
      setForm((prev) => ({ ...prev, photo: null }))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setForm((prev) => ({ ...prev, photo: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isDirty) return

    setStatus('saving')
    try {
      if (typeof onSave === 'function') {
        await onSave({ ...form })
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800))
      }

      setSaved({ ...form })        // commit — clears dirty state
      setStatus('success')
      setTimeout(() => setStatus(null), 3000)
    } catch (err) {
      console.error('Profile save failed:', err)
      console.error('Profile save response:', err?.response?.data || err?.data || err?.message)
      setStatus('error')
    }
  }

  const handleCancel = () => {
    setForm({ ...saved })          // revert all fields to last saved
    setStatus(null)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="badge-chip">{workspaceBadge}</span>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-white">{title}</h1>
        </div>
        <p className="max-w-2xl text-slate-300">{description}</p>
      </div>

      <Card className="p-8" hover={false}>
        <form className="grid gap-6 sm:grid-cols-2" onSubmit={handleSubmit}>
          <Input
            name="fullName"
            label={nameFieldLabel}
            placeholder="Enter your full name"
            value={form.fullName}
            onChange={handleChange}
          />
          <Input
            name="phone"
            label="Phone number"
            placeholder="+1 (555) 123-4567"
            value={form.phone}
            onChange={handleChange}
          />
          <Input
            name="city"
            label="City"
            placeholder="New York"
            value={form.city}
            onChange={handleChange}
          />
          <div className="sm:col-span-2">
            <FileUploadField
              label="Profile photo"
              accept="image/*"
              maxSize={5 * 1024 * 1024}
              file={form.photo instanceof File ? form.photo : null}
              onChange={handlePhotoChange}
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-4">
            <Button
            variant="outline"
              type="submit"
              disabled={!isDirty || status === 'saving'}
            >
              {status === 'saving' ? 'Saving…' : submitButtonLabel}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={handleCancel}
              disabled={!isDirty || status === 'saving'}
            >
              Cancel
            </Button>

            {/* status feedback */}
            {status === 'success' && (
              <span className="text-sm text-green-400">✓ Changes saved.</span>
            )}
            {status === 'error' && (
              <span className="text-sm text-red-400">Something went wrong. Try again.</span>
            )}
          </div>
        </form>
      </Card>

      {tips.length > 0 && (
        <Card className="p-6" hover={false}>
          <h3 className="text-lg font-semibold text-white mb-4">Tips</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}

export default DashboardProfileEditor