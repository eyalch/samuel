import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'
import styled from 'styled-components'

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

const LoadingButton = ({ loading, disabled, ...props }) => (
  <LoadingButtonContainer>
    <Button disabled={loading || disabled} {...props} />
    {loading && <ButtonProgress size={24} />}
  </LoadingButtonContainer>
)

export default LoadingButton
