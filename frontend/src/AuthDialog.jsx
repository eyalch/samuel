import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import CloseIcon from '@material-ui/icons/Close'
import ErrorIcon from '@material-ui/icons/Error'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import styled from 'styled-components'
import * as yup from 'yup'
import { useAuth } from './AuthProvider'
import { TextFormField } from './FormFields'

const StyledSnackbarMessage = styled.span`
  display: flex;
  align-items: center;
`
const StyledErrorIcon = styled(ErrorIcon)`
  margin-left: ${p => p.theme.spacing(1)}px;
`
const LoadingButtonContainer = styled.div`
  position: relative;
`
const ButtonProgress = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
`

const schema = yup.object({
  email: yup
    .string()
    .email('כתובת דוא"ל לא תקינה')
    .required('שדה חובה'),
  password: yup.string().required('שדה חובה'),
})

const AuthDialog = () => {
  const {
    showAuthDialog,
    setShowAuthDialog,
    authenticate,
    wrongCredentialsError,
    setWrongCredentialsError,
  } = useAuth()

  const handleSubmit = async (values, actions) => {
    await authenticate(values.email, values.password)
    actions.setSubmitting(false)
  }

  return (
    <>
      <Dialog
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        aria-labelledby="auth-dialog-title">
        <Formik
          validationSchema={schema}
          initialValues={{ email: '', password: '' }}
          onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <DialogTitle id="auth-dialog-title">התחברות</DialogTitle>
              <DialogContent>
                <Field
                  label='דוא"ל'
                  name="email"
                  component={TextFormField}
                  type="email"
                  inputProps={{ style: { direction: 'ltr' } }}
                />
                <Field
                  label="סיסמה"
                  name="password"
                  component={TextFormField}
                  type="password"
                  inputProps={{ style: { direction: 'ltr' } }}
                />
              </DialogContent>
              <DialogActions>
                <LoadingButtonContainer>
                  <Button type="submit" color="primary" disabled={isSubmitting}>
                    התחבר
                  </Button>
                  {isSubmitting && <ButtonProgress size={24} />}
                </LoadingButtonContainer>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      <WrongCredentialsSnackbar
        open={wrongCredentialsError}
        onClose={() => setWrongCredentialsError(false)}
      />
    </>
  )
}

export default AuthDialog

const WrongCredentialsSnackbar = ({ open, onClose }) => (
  <Snackbar
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    open={open}
    autoHideDuration={5000}
    onClose={(_event, reason) => {
      if (reason === 'clickaway') return

      onClose()
    }}
    ContentProps={{
      'aria-describedby': 'wrong-credentials-message',
    }}
    message={
      <StyledSnackbarMessage id="wrong-credentials-message">
        <StyledErrorIcon />
        דוא"ל או סיסמה שגויים
      </StyledSnackbarMessage>
    }
    action={[
      <IconButton
        key="close"
        aria-label="close"
        color="inherit"
        onClick={onClose}>
        <CloseIcon />
      </IconButton>,
    ]}
  />
)
