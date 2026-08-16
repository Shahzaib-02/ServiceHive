const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const cnicPattern = /^\d{5}-\d{7}-\d$/

export const validateEmail = (email) => emailPattern.test(email.trim())

export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters.'
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'Password must include letters and numbers.'
  }

  return ''
}

export const validateCnic = (cnic) => cnicPattern.test(cnic.trim())

export const validateRequired = (value) => String(value ?? '').trim().length > 0

export const extractFormErrors = (rules) =>
  Object.entries(rules).reduce((accumulator, [field, error]) => {
    if (error) {
      accumulator[field] = error
    }
    return accumulator
  }, {})
