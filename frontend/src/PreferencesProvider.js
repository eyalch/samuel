import axios from 'axios'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

const PreferencesContext = createContext()

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState({})

  const fetchPreferences = useCallback(async () => {
    const { data } = await axios.get('preferences')
    const _preferences = data.reduce(
      (acc, { key, value }) => ({ ...acc, [key]: value }),
      {}
    )
    setPreferences(_preferences)
  }, [])

  const value = useMemo(
    () => ({
      ...preferences,
      fetchPreferences,
    }),
    [fetchPreferences, preferences]
  )

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  )
}

export const usePreferences = () => useContext(PreferencesContext)
