import React, { useMemo } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import styled from 'styled-components'

import ConfirmOrderDialog from './ConfirmOrderDialog'
import { useDishes } from './DishesProvider'
import DishesSnackbars from './DishesSnackbars'
import FutureDishes from './FutureDishes'
import { getLocalDateISOString } from './helpers'
import TodayDishes from './TodayDishes'

const StyledProgress = styled(CircularProgress)`
  display: block;
  margin: auto;
`

export default function DishesPage() {
  const { loading, dishes, allowOrdersUntil, hasTimeLeft } = useDishes()

  const todayDate = useMemo(getLocalDateISOString, [hasTimeLeft])

  // Split the dishes into the arrays: dishes for today & future dishes
  const [todayDishes, futureDishes] = useMemo(
    () =>
      dishes.reduce(
        (result, dish) => {
          result[dish.date === todayDate ? 0 : 1].push(dish)
          return result
        },
        [[], []]
      ),
    [dishes, todayDate]
  )

  return (
    <>
      {loading || allowOrdersUntil === undefined ? (
        <StyledProgress color="inherit" />
      ) : (
        <>
          <TodayDishes dishes={todayDishes} />
          <FutureDishes dishes={futureDishes} />
        </>
      )}

      <ConfirmOrderDialog />

      <DishesSnackbars />
    </>
  )
}
