import axios from 'axios'

export async function getToken(email, password) {
  try {
    const { data } = await axios.post('token', { email, password })
    return data
  } catch (err) {
    throw err.response.data
  }
}

export async function getNewTokens(refreshToken) {
  try {
    const { data } = await axios.post('token/refresh', {
      refresh: refreshToken,
    })
    return data
  } catch (err) {
    throw err.response.data
  }
}
