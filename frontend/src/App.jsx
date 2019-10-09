import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import DishList from './DishList'
import Layout from './Layout'

const sleep = timeout =>
  new Promise((resolve, _) => setTimeout(resolve, timeout))

const StyledProgress = styled(CircularProgress)`
  display: block;
  margin: auto;
`

export default function App() {
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDishes = async () => {
      const res = await fetch('/api/dishes')
      const data = await res.json()
      setDishes(data)

      setLoading(false)
    }
    fetchDishes()
  }, [])

  return (
    <Layout>
      {loading ? (
        <StyledProgress color="inherit" />
      ) : dishes.length ? (
        <DishList dishes={dishes} />
      ) : (
        <Typography variant="h3" component="p" align="center">
          אין מנות להיום!
        </Typography>
      )}
    </Layout>
  )
}
