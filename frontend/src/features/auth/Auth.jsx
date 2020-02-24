import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import AuthDialog from './AuthDialog'
import LogoutDialog from './LogoutDialog'
import { fetchUserInfo } from './authSlice'

const Auth = () => {
  const { authenticated } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    if (authenticated) dispatch(fetchUserInfo())
  }, [authenticated, dispatch])

  return (
    <>
      <AuthDialog />
      <LogoutDialog />
    </>
  )
}

export default Auth
