import React from 'react'
import { AuthProvider } from './auth/AuthProvider'
import { DishesProvider } from './dishes/DishesProvider'
import { PreferencesProvider } from './PreferencesProvider'

export default function withProviders(App) {
  return () => (
    <PreferencesProvider>
      <AuthProvider>
        <DishesProvider>
          <App />
        </DishesProvider>
      </AuthProvider>
    </PreferencesProvider>
  )
}
