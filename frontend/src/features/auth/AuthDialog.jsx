import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Field, Form, Formik } from 'formik'
import * as yup from 'yup'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'
import Error from '@material-ui/icons/Error'

import {
  authenticate,
  setShowAuthDialog,
  hideCredentialsError,
} from './authSlice'
import { TextFormField } from 'common/FormFields'
import LoadingButton from 'common/LoadingButton'
import Snackbar from 'common/Snackbar'

const schema = yup.object({
  email: yup
    .string()
    .email('כתובת דוא"ל לא תקינה')
    .required('שדה חובה'),
  password: yup.string().required('שדה חובה'),
})

const AuthDialog = () => {
  const dispatch = useDispatch()

  const handleSubmit = async (values, actions) => {
    await dispatch(authenticate(values.email, values.password))
    actions.setSubmitting(false)
  }

  const { showAuthDialog, credentialsError } = useSelector(state => state.auth)

  return (
    <>
      <Dialog
        open={showAuthDialog}
        onClose={() => dispatch(setShowAuthDialog(false))}
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
                  label='דוא"ל במשרד'
                  name="email"
                  component={TextFormField}
                  type="email"
                  inputProps={{ style: { direction: 'ltr' } }}
                />
                <Field
                  label="סיסמה במחשב"
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
                  color="primary"
                  size="large">
                  התחבר
                </LoadingButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      <Snackbar
        open={credentialsError}
        onClose={() => dispatch(hideCredentialsError())}
        messageId="wrong-credentials-message"
        icon={Error}
        message='דוא"ל או סיסמה שגויים'
      />
    </>
  )
}

export default AuthDialog
