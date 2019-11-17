import { getAccessToken, refreshToken } from './AuthProvider'
import endpoints from './endpoints'

// Monkey-patch the `fetch` function to include an access token (if exists) and
// handle common errors (e.g auto-refresh expired token)

// eslint-disable-next-line no-native-reassign
fetch = (originalFetch => async (path, options = {}) => {
  const token = getAccessToken()

  options.headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  let res = await originalFetch.apply(this, [path, options])

  // Handle common errors
  if (!res.ok) {
    const resClone = res.clone()
    const data = await resClone.json()

    // If the token is invalid then we refresh it and retry the request
    if (data.code === 'token_not_valid') {
      // If the refresh token itself is invalid, we just return the response
      if (path === endpoints.REFRESH_TOKEN) return res

      // Retry the request only if the token was successfully refreshed
      if (await refreshToken()) {
        res = await fetch(path, options)
      }
    }
  }

  return res
})(fetch)
