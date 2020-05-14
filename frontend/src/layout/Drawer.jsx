import {
  Divider,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import LocalHospitalIcon from "@material-ui/icons/LocalHospital"
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew"
import { setShowAuthDialog, setShowLogoutDialog } from "features/auth/authSlice"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import styled from "styled-components"

const StyledDrawer = styled(({ ...props }) => (
  <MuiDrawer classes={{ paper: "paper" }} {...props} />
))`
  & .paper {
    width: 270px;
  }
`
const StyledUserDetails = styled.div`
  padding: ${(p) => p.theme.spacing(2)}px;
  direction: ltr;
  display: flex;
  align-items: center;
`
const StyledAccountCircleIcon = styled(AccountCircleIcon)`
  margin-right: ${(p) => p.theme.spacing(1)}px;
`

const Drawer = ({ open, onClose }) => {
  const { authenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  return (
    <StyledDrawer open={open} onClose={onClose}>
      {authenticated && user && (
        <>
          <StyledUserDetails>
            <StyledAccountCircleIcon fontSize="large" />
            <div>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="subtitle2">{user.email}</Typography>
            </div>
          </StyledUserDetails>

          <Divider />
        </>
      )}

      <List>
        {authenticated && user ? (
          <ListItem
            button
            onClick={() => {
              dispatch(setShowLogoutDialog(true))
              onClose()
            }}
          >
            <ListItemIcon>
              <PowerSettingsNewIcon />
            </ListItemIcon>
            <ListItemText primary="התנתקות" />
          </ListItem>
        ) : (
          <ListItem
            button
            onClick={() => {
              dispatch(setShowAuthDialog(true))
              onClose()
            }}
          >
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="התחברות" />
          </ListItem>
        )}

        <ListItem button onClick={onClose} component={Link} to="/corona">
          <ListItemIcon>
            <LocalHospitalIcon />
          </ListItemIcon>
          <ListItemText primary="הצהרת בריאות" />
        </ListItem>
      </List>
    </StyledDrawer>
  )
}

export default Drawer
