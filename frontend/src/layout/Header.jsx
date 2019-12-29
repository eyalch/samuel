import React from 'react'
import styled from 'styled-components'

import logo from './logo.svg'

const StyledHeader = styled.header`
  padding-top: ${p => p.theme.spacing(3)}px;
  padding-bottom: ${p => p.theme.spacing(3)}px;
  text-align: center;

  ${p => p.theme.breakpoints.up('sm')} {
    padding-top: ${p => p.theme.spacing(4)}px;
    padding-bottom: ${p => p.theme.spacing(5)}px;
  }
`
const StyledLogo = styled.img`
  width: 45vmin;
  max-height: 120px;
  pointer-events: none;
`

const Header = () => (
  <StyledHeader>
    <StyledLogo src={logo} alt="logo" />
  </StyledHeader>
)

export default Header
