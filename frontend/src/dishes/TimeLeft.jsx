import Typography from '@material-ui/core/Typography'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDishes } from './DishesProvider'

const StyledContainer = styled.div`
  margin-top: -${p => p.theme.spacing(1)}px;
  height: 62px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ${p => p.theme.breakpoints.up('sm')} {
    margin-top: -${p => p.theme.spacing(2)}px;
  }
`

const TimeLeft = () => {
  const { allowOrdersUntil, hasTimeLeft, setHasTimeLeft } = useDishes()

  const [timeLeftToOrderInMillis, setTimeLeftToOrderInMillis] = useState(
    allowOrdersUntil - new Date()
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const millisLeft = allowOrdersUntil - new Date()

      setTimeLeftToOrderInMillis(millisLeft)

      if (!hasTimeLeft && millisLeft > 0) {
        setHasTimeLeft(true)
      } else if (hasTimeLeft && millisLeft <= 0) {
        setHasTimeLeft(false)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [allowOrdersUntil, hasTimeLeft, setHasTimeLeft])

  return (
    <StyledContainer>
      {timeLeftToOrderInMillis < 0 ? (
        <Typography variant="h4" component="h2">
          ההזמנה להיום נסגרה
        </Typography>
      ) : (
        <>
          <Typography variant="subtitle2">זמן שנותר לביצוע הזמנה:</Typography>
          <Typography variant="h4" component="h2">
            {new Date(timeLeftToOrderInMillis).toISOString().slice(11, 19)}
          </Typography>
        </>
      )}
    </StyledContainer>
  )
}

export default TimeLeft
