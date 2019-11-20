import React, { createContext, useState, useContext, useEffect } from 'react'
import { GET } from './api/httpHelpers'
import endpoints from './api/endpoints'

const PreferencesContext = createContext()

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({})

  useEffect(() => {
    GET(endpoints.PREFERENCES)
      .then(res => res.json())
      .then(data =>
        setPreferences(
          data.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {})
        )
      )
  }, [])

  return (
    <PreferencesContext.Provider value={preferences}>
      {children}
    </PreferencesContext.Provider>
  )
}

export const usePreferences = () => useContext(PreferencesContext)
