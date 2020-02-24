import React from 'react'
import styled from 'styled-components'
import {
  Drawer as MuiDrawer,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'
import { useSelector, useDispatch } from 'react-redux'

import { setShowAuthDialog, setShowLogoutDialog } from 'features/auth/authSlice'

const StyledDrawer = styled(({ ...props }) => (
  <MuiDrawer classes={{ paper: 'paper' }} {...props} />
))`
  & .paper {
    width: 270px;
  }
`
const StyledUserDetails = styled.div`
  padding: ${p => p.theme.spacing(2)}px;
  direction: ltr;
  display: flex;
  align-items: center;
`
const StyledAccountCircleIcon = styled(AccountCircleIcon)`
  margin-right: ${p => p.theme.spacing(1)}px;
`

const Drawer = ({ open, onClose }) => {
  const { authenticated, user } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  return (
    <StyledDrawer open={open} onClose={onClose}>
      {authenticated && user ? (
        <>
          <StyledUserDetails>
            <StyledAccountCircleIcon fontSize="large" />
            <div>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="subtitle2">{user.email}</Typography>
            </div>
          </StyledUserDetails>

          <Divider />

          <List>
            <ListItem
              button
              onClick={() => {
                dispatch(setShowLogoutDialog(true))
                onClose()
              }}>
              <ListItemIcon>
                <PowerSettingsNewIcon />
              </ListItemIcon>
              <ListItemText primary="התנתקות" />
            </ListItem>
          </List>
        </>
      ) : (
        <List>
          <ListItem
            button
            onClick={() => {
              dispatch(setShowAuthDialog(true))
              onClose()
            }}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="התחברות" />
          </ListItem>
        </List>
      )}
    </StyledDrawer>
  )
}

export default Drawer
