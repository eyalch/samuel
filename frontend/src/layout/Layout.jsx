import { Container } from "@material-ui/core"
import React, { useState } from "react"
import styled from "styled-components"
import Drawer from "./Drawer"
import Header from "./Header"

const StyledContainer = styled(Container)`
  padding-bottom: ${(p) => p.theme.spacing(3)}px;
`

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <StyledContainer>
      <Header onOpenDrawer={() => setDrawerOpen(true)} />

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main>{children}</main>
    </StyledContainer>
  )
}

export default Layout
