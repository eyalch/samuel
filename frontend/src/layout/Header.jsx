import React from 'react'
import styled, { keyframes } from 'styled-components'
import logo from './logo.svg'

export const LOGO_ANIMATION_DELAY = 600
export const LOGO_ANIMATION_DURATION = 450

const introKeyframes = keyframes`
  from { transform: translateY(calc(50vh - 100%)) scale(1.9); }
  to { transform: translateY(0) scale(1); }
`

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
  /* animation: ${introKeyframes} ease-in both;
  animation-duration: ${LOGO_ANIMATION_DURATION}ms;
  animation-delay: ${LOGO_ANIMATION_DELAY}ms; */
`

const Header = () => (
  <StyledHeader>
    <StyledLogo src={logo} alt="logo" />
  </StyledHeader>
)

export default Header
