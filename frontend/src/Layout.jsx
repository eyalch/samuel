import Container from '@material-ui/core/Container'
import React from 'react'
import styled, { keyframes } from 'styled-components'
import Header, { LOGO_ANIMATION_DELAY, LOGO_ANIMATION_DURATION } from './Header'

const mainReveal = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const StyledMain = styled.main`
  color: white;
  /* animation: ${mainReveal} 450ms ease both;
  animation-delay: ${LOGO_ANIMATION_DELAY + LOGO_ANIMATION_DURATION}ms; */
`

const Layout = ({ children }) => (
  <Container>
    <Header />

    <StyledMain>{children}</StyledMain>
  </Container>
)

export default Layout
