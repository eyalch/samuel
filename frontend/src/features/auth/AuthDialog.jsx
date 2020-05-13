import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core"
import { TextFormField } from "common/FormFields"
import LoadingButton from "common/LoadingButton"
import SnackbarAlert from "common/SnackbarAlert"
import { Field, Form, Formik } from "formik"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import * as yup from "yup"
import {
  authenticate,
  messages,
  resetMessage,
  setShowAuthDialog,
} from "./authSlice"

const schema = yup.object({
  username: yup.string().required("שדה חובה"),
  password: yup.string().required("שדה חובה"),
})

const AuthDialog = () => {
  const dispatch = useDispatch()

  const handleSubmit = async (values, actions) => {
    await dispatch(authenticate(values.username, values.password))
    actions.setSubmitting(false)
  }

  const { showAuthDialog, message } = useSelector((state) => state.auth)

  return (
    <>
      <Dialog
        open={showAuthDialog}
        onClose={() => dispatch(setShowAuthDialog(false))}
        scroll="body"
        aria-labelledby="auth-dialog-title"
      >
        <Formik
          validationSchema={schema}
          initialValues={{ username: "", password: "" }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <DialogTitle id="auth-dialog-title">התחברות</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  הזינו את פרטי ההזדהות למחשב/אימייל במשרד
                </DialogContentText>

                <Field
                  label="אימייל/משתמש משרדי"
                  name="username"
                  component={TextFormField}
                  type="text"
                  inputProps={{ style: { direction: "ltr" } }}
                />
                <Field
                  label="סיסמה למחשב"
                  name="password"
                  component={TextFormField}
                  type="password"
                  inputProps={{ style: { direction: "ltr" } }}
                />
              </DialogContent>
              <DialogActions>
                <LoadingButton
                  loading={isSubmitting}
                  type="submit"
                  variant="contained"
                  size="large"
                >
                  כניסה
                </LoadingButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      <SnackbarAlert
        open={message === messages.INVALID_CREDENTIALS}
        onClose={() => dispatch(resetMessage())}
        messageId="wrong-credentials-message"
        message="הפרטים שהזנת שגויים"
        severity="error"
      />
      <SnackbarAlert
        open={message === messages.RE_LOGIN}
        onClose={() => dispatch(resetMessage())}
        messageId="re-login-message"
        message="יש להזדהות מחדש"
        severity="warning"
      />
    </>
  )
}

export default AuthDialog
