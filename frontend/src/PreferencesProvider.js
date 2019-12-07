import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'

const PreferencesContext = createContext()

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({})

  useEffect(() => {
    axios.get('preferences').then(res => {
      const _preferences = res.data.reduce(
        (acc, { key, value }) => ({ ...acc, [key]: value }),
        {}
      )
      setPreferences(_preferences)
    })
  }, [])

  return (
    <PreferencesContext.Provider value={preferences}>
      {children}
    </PreferencesContext.Provider>
  )
}

export const usePreferences = () => useContext(PreferencesContext)
