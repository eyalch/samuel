import React from 'react'
import styled from 'styled-components'
import { Container } from '@material-ui/core'

import Header from './Header'

const StyledMain = styled.main`
  color: white;
`

const Layout = ({ children }) => (
  <Container>
    <Header />

    <StyledMain>{children}</StyledMain>
  </Container>
)

export default Layout
