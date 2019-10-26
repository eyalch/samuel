import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import DishList from './DishList'
import Layout from './Layout'
import { useDishes } from './DishesProvider'

const StyledProgress = styled(CircularProgress)`
  display: block;
  margin: auto;
`

const App = () => {
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)

  const { fetchDishes } = useDishes()

  useEffect(() => {
    fetchDishes().then(dishes => {
      setDishes(dishes)
      setLoading(false)
    })
  }, [fetchDishes])

  return (
    <Layout>
      {loading ? (
        <StyledProgress color="inherit" />
      ) : dishes.length ? (
        <DishList
          dishes={dishes}
          openAuthDialog={() => setShowAuthDialog(true)}
        />
      ) : (
        <Typography variant="h4" component="p" align="center">
          אין מנות להיום
        </Typography>
      )}
    </Layout>
  )
}

export default App
