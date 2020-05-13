import { Slide, Snackbar } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import React from "react"

const SnackbarAlert = ({
  open,
  onClose,
  messageId,
  message,
  icon,
  ContentProps,
  severity = "info",
  ...props
}) => (
  <Snackbar
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    open={open}
    autoHideDuration={5000}
    onClose={(_event, reason) => {
      if (reason === "clickaway") return
      onClose()
    }}
    ContentProps={{
      "aria-describedby": messageId,
      ...ContentProps,
    }}
    TransitionComponent={Slide}
    {...props}
  >
    <Alert variant="filled" severity={severity}>
      {message}
    </Alert>
  </Snackbar>
)

export default SnackbarAlert
