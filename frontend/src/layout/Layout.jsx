import { Container } from "@material-ui/core"
import React, { useState } from "react"
import Drawer from "./Drawer"
import Header from "./Header"

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <Container>
      <Header onOpenDrawer={() => setDrawerOpen(true)} />

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main>{children}</main>
    </Container>
  )
}

export default Layout
