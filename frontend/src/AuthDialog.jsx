import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ErrorIcon from '@material-ui/icons/Error'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import styled from 'styled-components'
import * as yup from 'yup'
import { useAuth } from './AuthProvider'
import { TextFormField } from './FormFields'
import Snackbar from './Snackbar'

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
    showWrongCredentialsError,
    hideWrongCredentialsError,
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

      <Snackbar
        open={showWrongCredentialsError}
        onClose={hideWrongCredentialsError}
        messageId="wrong-credentials-message"
        icon={ErrorIcon}
        message='דוא"ל או סיסמה שגויים'
      />
    </>
  )
}

export default AuthDialog
