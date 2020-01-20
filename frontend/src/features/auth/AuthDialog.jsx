import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Field, Form, Formik } from 'formik'
import * as yup from 'yup'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from '@material-ui/core'

import {
  authenticate,
  setShowAuthDialog,
  hideCredentialsError,
} from './authSlice'
import { TextFormField } from 'common/FormFields'
import LoadingButton from 'common/LoadingButton'
import SnackbarAlert from 'common/SnackbarAlert'

const schema = yup.object({
  usernameOrEmail: yup.string().required('שדה חובה'),
  password: yup.string().required('שדה חובה'),
})

const AuthDialog = () => {
  const dispatch = useDispatch()

  const handleSubmit = async (values, actions) => {
    const username = values.usernameOrEmail.split('@')[0]
    await dispatch(authenticate(username, values.password))
    actions.setSubmitting(false)
  }

  const { showAuthDialog, credentialsError } = useSelector(state => state.auth)

  return (
    <>
      <Dialog
        open={showAuthDialog}
        onClose={() => dispatch(setShowAuthDialog(false))}
        scroll="body"
        aria-labelledby="auth-dialog-title">
        <Formik
          validationSchema={schema}
          initialValues={{ usernameOrEmail: '', password: '' }}
          onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <DialogTitle id="auth-dialog-title">התחברות</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  מלאו את פרטי ההזדהות המשמשים לכניסה למחשב בעבודה
                </DialogContentText>

                <Field
                  label='שם משתמש/דוא"ל'
                  name="usernameOrEmail"
                  component={TextFormField}
                  type="text"
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
                <LoadingButton
                  loading={isSubmitting}
                  type="submit"
                  size="large">
                  כניסה
                </LoadingButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      <SnackbarAlert
        open={credentialsError}
        onClose={() => dispatch(hideCredentialsError())}
        messageId="wrong-credentials-message"
        message='דוא"ל או סיסמה שגויים'
        severity="error"
      />
    </>
  )
}

export default AuthDialog
