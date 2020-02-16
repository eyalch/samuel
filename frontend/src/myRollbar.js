import Rollbar from 'rollbar'

export const rollbar = new Rollbar({
  accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: process.env.NODE_ENV,
    client: {
      javascript: {
        code_version: process.env.REACT_APP_VERSION,
      },
    },
  },
})
