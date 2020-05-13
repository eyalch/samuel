import { TextField } from "@material-ui/core"
import { getIn } from "formik"
import React from "react"

export const TextFormField = ({ field, form, ...props }) => {
  const errorText =
    getIn(form.touched, field.name) && getIn(form.errors, field.name)

  return (
    <TextField
      fullWidth
      margin="normal"
      variant="outlined"
      helperText={errorText}
      error={!!errorText}
      {...field}
      {...props}
    />
  )
}
