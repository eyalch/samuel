import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDishes } from './DishesProvider'
import DishList from './DishList'

const StyledProgress = styled(CircularProgress)`
  display: block;
  margin: auto;
`

const DishesPage = () => {
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
    <div>
      {loading ? (
        <StyledProgress color="inherit" />
      ) : dishes.length ? (
        <DishList dishes={dishes} />
      ) : (
        <Typography variant="h4" component="p" align="center">
          אין מנות להיום
        </Typography>
      )}
    </div>
  )
}

export default DishesPage
