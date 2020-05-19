import axios from "axios"

export const getToken = (username, password) =>
  axios.post("/api/token", { username, password })

export const refreshTokens = (refreshToken) =>
  axios.post(
    "/api/token/refresh",
    { refresh: refreshToken },
    { __isRefreshingTokens: true }
  )

export const getUserInfo = () => axios.get("/api/users/me")
