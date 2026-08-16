import React from 'react'
import { AppProvider } from './AppContext'

export const AppProviders = ({ children }) => (
  <AppProvider>{children}</AppProvider>
)
