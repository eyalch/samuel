import { axios } from 'test-utils'
import jwt from 'jsonwebtoken'

import { getAccessToken, updateTokens } from 'features/auth/authHelpers'
import { handleUnauthorized } from './axios'

const resolveTimeout = (payload, ms) =>
  new Promise(resolve => setTimeout(() => resolve(payload), ms))

describe('invalid token', () => {
  const invalidTokenResponse = {
    status: 401,
    config: { url: '' },
    data: { code: 'token_not_valid' },
  }

  const refreshResponse = {
    data: {
      access: jwt.sign({ user_id: 1 }, 'test'),
      refresh: jwt.sign({ user_id: 1 }, 'test'),
    },
  }

  const runInterceptor = () =>
    handleUnauthorized({ response: invalidTokenResponse })

  const getRefreshCallsCount = () =>
    axios.post.mock.calls.filter(([url]) => url.includes('refresh')).length

  beforeEach(() => {
    axios.post.mockResolvedValueOnce(refreshResponse)
  })

  test('should remove the invalid access token', () => {
    updateTokens({ access: 'some-invalid-token' })

    expect(getAccessToken()).not.toBeNull()

    // No need to await because it should remove the invalid access token
    // synchronously and as soon as possible
    runInterceptor()

    expect(getAccessToken()).toBeNull()
  })

  test('should retry the request after refreshing the tokens', async () => {
    await runInterceptor()

    expect(axios.request).toHaveBeenCalledWith(invalidTokenResponse.config)
  })

  test('should refresh only if not already refreshing', async () => {
    axios.post.mockReset()

    // Set the refresh request to be taking 50ms to resolve
    axios.post.mockImplementation(() => resolveTimeout(refreshResponse, 50))

    await Promise.all([
      runInterceptor(), // Send immediately
      resolveTimeout(null, 20).then(() => runInterceptor()), // Send after 20ms
      resolveTimeout(null, 40).then(() => runInterceptor()), // Send after 40ms
    ])

    expect(getRefreshCallsCount()).toBe(1)

    axios.post.mockClear()

    await Promise.all([
      runInterceptor(), // Send immediately
      resolveTimeout(null, 80).then(() => runInterceptor()), // Send after 80ms
      resolveTimeout(null, 150).then(() => runInterceptor()), // Send after 150ms
    ])

    expect(getRefreshCallsCount()).toBe(3)
  })
})
