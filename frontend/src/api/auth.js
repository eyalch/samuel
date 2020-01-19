import axios from 'axios'

export const getToken = async (username, password) => {
  const res = await axios.post('token', { username, password })
  return res.data
}

export const getNewTokens = async refreshToken => {
  const res = await axios.post('token/refresh', { refresh: refreshToken })
  return res.data
}
