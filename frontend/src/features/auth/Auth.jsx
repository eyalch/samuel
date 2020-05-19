import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import AuthDialog from "./AuthDialog"
import { fetchUserInfo } from "./authSlice"
import LogoutDialog from "./LogoutDialog"

const Auth = () => {
  const { authenticated } = useSelector((state) => state.auth)
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
