import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import DoneOutlineIcon from '@material-ui/icons/DoneOutline'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import ConfirmOrderDialog from './ConfirmOrderDialog'
import { useDishes } from './DishesProvider'
import { getLocalDateISOString } from './helpers'
import placeholderImage from './placeholder.png'

const StyledCard = styled(Card)`
  position: relative;
  display: flex;
  flex-direction: column;
`
const StyledCardMedia = styled(({ isPlaceholder, ...props }) => (
  <CardMedia {...props} />
))`
  height: 240px;
  background-size: ${p =>
    p.isPlaceholder ? `auto calc(100% - ${p.theme.spacing(4)}px)` : 'cover'};
`
const StyledIndicatorsOverlay = styled.div`
  height: 100%;
  background-image: radial-gradient(
    circle at bottom left,
    rgba(0, 0, 0, 0.4),
    rgba(0, 0, 0, 0)
  );
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: ${p => p.theme.spacing(1)}px;
`
const StyledCardActions = styled(CardActions)`
  margin-top: auto;
`
const StyledLoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: space-around;
  justify-content: space-evenly;
  align-items: center;
  padding: 0 ${p => p.theme.spacing(1)}px;
`

const Dish = ({ dish }) => {
  const [loading, setLoading] = useState(false)
  const [showConfirmOrderDialog, setShowConfirmOrderDialog] = useState(false)

  const { orderDish, cancelOrder, hasTimeLeft, didOrderForDate } = useDishes()

  // If there's time left to order today OR the dish is not for today,
  // then the user is allowed to order
  const isAllowedToOrder = useMemo(() => {
    const isDishForToday = getLocalDateISOString() === dish.date
    return hasTimeLeft || !isDishForToday
  }, [dish.date, hasTimeLeft])

  const onOrder = async () => {
    if (!isAllowedToOrder) return

    // Show a confirm dialog if the user has already made an order
    if (didOrderForDate(dish.date) && !showConfirmOrderDialog) {
      setShowConfirmOrderDialog(true)
      return
    } else if (showConfirmOrderDialog) {
      setShowConfirmOrderDialog(false)
    }

    setLoading(true)
    await orderDish(dish)
    setLoading(false)
  }

  const onCancel = async () => {
    if (!isAllowedToOrder) return

    setLoading(true)
    await cancelOrder(dish)
    setLoading(false)
  }

  const isOrdered = dish.orders_count > 0

  return (
    <>
      <StyledCard component="li">
        <StyledCardMedia
          image={dish.image || placeholderImage}
          isPlaceholder={!dish.image}>
          {isOrdered && (
            <StyledIndicatorsOverlay>
              {// Show an icon for every order of the dish
              Array(dish.orders_count)
                .fill()
                .map((_, i) => (
                  <DoneOutlineIcon key={i} style={{ fontSize: 56 }} />
                ))}
            </StyledIndicatorsOverlay>
          )}
        </StyledCardMedia>

        <CardContent>
          <Typography gutterBottom variant="h5" component="h3">
            {dish.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {dish.description}
          </Typography>
        </CardContent>

        {isAllowedToOrder && (
          <StyledCardActions>
            <Button
              color="primary"
              size="large"
              onClick={onOrder}
              disabled={loading}>
              {isOrdered ? 'להזמנה נוספת' : 'להזמנה'}
            </Button>
            {isOrdered && (
              <Button
                color="primary"
                size="large"
                onClick={onCancel}
                disabled={loading}>
                ביטול
              </Button>
            )}
          </StyledCardActions>
        )}

        {loading && (
          <StyledLoadingOverlay>
            <CircularProgress size={72} />
          </StyledLoadingOverlay>
        )}
      </StyledCard>

      <ConfirmOrderDialog
        open={showConfirmOrderDialog}
        dishDate={dish.date}
        onClose={() => setShowConfirmOrderDialog(false)}
        onAgree={onOrder}
      />
    </>
  )
}

export default Dish
