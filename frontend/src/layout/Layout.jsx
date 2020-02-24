import React, { useState } from 'react'
import { Container } from '@material-ui/core'

import Header from './Header'
import Drawer from './Drawer'

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
