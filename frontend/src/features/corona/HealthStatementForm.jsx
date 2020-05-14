import { Container, Typography } from "@material-ui/core"
import * as api from "api"
import LoadingButton from "common/LoadingButton"
import { stateHealthSuccess } from "features/auth/authSlice"
import { Field, Form, Formik } from "formik"
import { CheckboxWithLabel } from "formik-material-ui"
import React from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import * as yup from "yup"

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
`
const StyledFieldWrapper = styled.div`
  margin-bottom: ${(p) => p.theme.spacing(2)}px;
`
const StyledButton = styled(LoadingButton)`
  align-self: flex-end;
  margin-bottom: ${(p) => p.theme.spacing(3)}px;
`

const schema = yup.object({
  noFever: yup.boolean().oneOf([true]),
  noBreathingProblems: yup.boolean().oneOf([true]),
})

const HealthStatementForm = () => {
  const dispatch = useDispatch()

  return (
    <Container maxWidth="sm" disableGutters>
      <Formik
        validationSchema={schema}
        initialValues={{ noFever: false, noBreathingProblems: false }}
        onSubmit={async (_values, actions) => {
          await api.corona.stateHealth()

          actions.setSubmitting(false)

          dispatch(stateHealthSuccess())
        }}
        validateOnMount
      >
        {({ isValid, isSubmitting }) => (
          <StyledForm>
            <StyledFieldWrapper>
              <Field
                component={CheckboxWithLabel}
                type="checkbox"
                name="noFever"
                Label={{
                  label:
                    "אני מצהיר/ה כי ערכתי היום בדיקה למדידת חום גוף, בה נמצא כי חום גופי אינו עולה על 38 מעלות צלזיוס.",
                }}
                color="primary"
              />
            </StyledFieldWrapper>
            <StyledFieldWrapper>
              <Field
                component={CheckboxWithLabel}
                type="checkbox"
                name="noBreathingProblems"
                Label={{
                  label:
                    "אני מצהיר/ה כי איני משתעל/ת וכן כי אין לי קשיים בנשימה*.",
                }}
                color="primary"
              />
            </StyledFieldWrapper>

            <StyledButton
              type="submit"
              variant="contained"
              disabled={!isValid}
              loading={isSubmitting}
            >
              שלח
            </StyledButton>

            <Typography variant="body2">
              *למעט שיעול או קושי בנשימה הנובע ממצב כרוני כגון אסטמה או אלרגיה
              אחרת.
            </Typography>
          </StyledForm>
        )}
      </Formik>
    </Container>
  )
}

export default HealthStatementForm
