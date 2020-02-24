import axios from 'axios'

export const getToken = async (username, password) => {
  const res = await axios.post('token', { username, password })
  return res.data
}

export const refreshTokens = async refreshToken => {
  const res = await axios.post(
    'token/refresh',
    { refresh: refreshToken },
    { __isRefreshingTokens: true }
  )
  return res.data
}

export const getUserInfo = async () => {
  const res = await axios.get('users/me')
  return res.data
}
