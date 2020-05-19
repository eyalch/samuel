import jwt from "jsonwebtoken"

const KEY_ACCESS_TOKEN = "access_token"
const KEY_REFRESH_TOKEN = "refresh_token"

export const getAccessToken = () => localStorage.getItem(KEY_ACCESS_TOKEN)
export const getRefreshToken = () => localStorage.getItem(KEY_REFRESH_TOKEN)

export const updateTokens = ({ access, refresh }) => {
  localStorage.setItem(KEY_ACCESS_TOKEN, access)
  localStorage.setItem(KEY_REFRESH_TOKEN, refresh)
}

export const removeAccessToken = () => localStorage.removeItem(KEY_ACCESS_TOKEN)
export const removeRefreshToken = () =>
  localStorage.removeItem(KEY_REFRESH_TOKEN)

export const isTokenExpired = (token) => {
  const decoded = jwt.decode(token)

  if (!decoded) return false

  return Date.now() >= decoded.exp * 1000
}
