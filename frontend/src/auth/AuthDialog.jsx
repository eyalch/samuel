import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ErrorIcon from '@material-ui/icons/Error'
import { Field, Form, Formik } from 'formik'
import React from 'react'
import * as yup from 'yup'
import { TextFormField } from '../common/FormFields'
import LoadingButton from '../common/LoadingButton'
import Snackbar from '../common/Snackbar'
import { useAuth } from './AuthProvider'

const schema = yup.object({
  email: yup
    .string()
    .email('כתובת דוא"ל לא תקינה')
    .required('שדה חובה'),
  password: yup.string().required('שדה חובה'),
})

export default function AuthDialog() {
  const {
    showAuthDialog,
    setShowAuthDialog,
    authenticate,
    showCredentialsError,
    hideCredentialsError,
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
        open={showCredentialsError}
        onClose={hideCredentialsError}
        messageId="wrong-credentials-message"
        icon={ErrorIcon}
        message='דוא"ל או סיסמה שגויים'
      />
    </>
  )
}
