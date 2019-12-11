import Slide from '@material-ui/core/Slide'
import MSnackbar from '@material-ui/core/Snackbar'
import React from 'react'
import styled from 'styled-components'

const StyledSnackbarMessage = styled.span`
  display: flex;
  align-items: center;
`

const Snackbar = ({
  open,
  onClose,
  messageId,
  message,
  icon,
  ContentProps,
  ...props
}) => {
  const StyledIcon = icon
    ? styled(icon)`
        margin-left: ${p => p.theme.spacing(1)}px;
      `
    : null

  return (
    <MSnackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      autoHideDuration={5000}
      onClose={(_event, reason) => {
        if (reason === 'clickaway') return
        onClose()
      }}
      message={
        <StyledSnackbarMessage id={messageId}>
          {StyledIcon && <StyledIcon />}
          {message}
        </StyledSnackbarMessage>
      }
      ContentProps={{
        'aria-describedby': messageId,
        ...ContentProps,
      }}
      TransitionComponent={Slide}
      {...props}
    />
  )
}

export default Snackbar