import React from 'react'
import styled from 'styled-components'
import { IconButton } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

import logo from './logo.svg'

const StyledHeader = styled.header`
  padding-top: ${p => p.theme.spacing(3)}px;
  padding-bottom: ${p => p.theme.spacing(3)}px;
  text-align: center;
  position: relative;

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
const StyledMenuIconButton = styled(IconButton)`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`

const Header = ({ onOpenDrawer }) => (
  <StyledHeader>
    <StyledMenuIconButton onClick={onOpenDrawer}>
      <MenuIcon />
    </StyledMenuIconButton>

    <StyledLogo src={logo} alt="logo" />
  </StyledHeader>
)

export default Header
