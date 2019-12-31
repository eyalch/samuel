import axios from 'axios'

export const getToken = (email, password) =>
  axios.post('token', { email, password })

export const getNewTokens = refreshToken =>
  axios.post('token/refresh', { refresh: refreshToken })
