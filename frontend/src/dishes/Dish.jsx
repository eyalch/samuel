import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import CancelIcon from '@material-ui/icons/Cancel'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { useDishes } from './DishesProvider'
import placeholderImage from './placeholder.png'

const StyledCardActionArea = styled(CardActionArea)`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
`
const StyledCardMedia = styled(({ isPlaceholder, ...props }) => (
  <CardMedia {...props} />
))`
  height: 240px;
  background-size: ${p =>
    p.isPlaceholder ? `auto calc(100% - ${p.theme.spacing(4)}px)` : 'cover'};
`
const StyledOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
`
const StyledProgress = styled(CircularProgress)`
  position: absolute;
  top: calc(50% - 24px);
  left: calc(50% - 24px);
`
const StyledCheckIcon = styled(CheckCircleIcon)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 150px;
`
const actionIconCss = css`
  font-size: 50px;
  display: block;
`
const StyledCancelIcon = styled(CancelIcon)`
  ${actionIconCss}
`
const StyledActionButton = styled.button`
  all: unset;
  position: absolute;
  top: ${p => p.theme.spacing(1)}px;
  transition: all 200ms;
  cursor: pointer;
  ${p =>
    p.right
      ? css`
          right: ${p.theme.spacing(1)}px;
          transform: translateX(calc(100% + ${p.theme.spacing(1)}px));
        `
      : p.left
      ? css`
          left: ${p.theme.spacing(1)}px;
          transform: translateX(calc(-100% - ${p.theme.spacing(1)}px));
        `
      : ''};

  :focus,
  ${StyledOverlay}:hover & {
    transform: translateX(0);
  }
`

const Dish = ({ dish }) => {
  const [loading, setLoading] = useState(false)

  const { orderDish, cancelOrder, hasTimeLeft } = useDishes()

  const handleOrder = async () => {
    if (dish.did_user_order_today || !hasTimeLeft) return

    setLoading(true)
    await orderDish(dish.id)
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!dish.did_user_order_today || !hasTimeLeft) return

    setLoading(true)
    await cancelOrder(dish.id)
    setLoading(false)
  }

  return (
    <Card component="li" style={{ position: 'relative' }}>
      <StyledCardActionArea
        onClick={handleOrder}
        disabled={dish.did_user_order_today || !hasTimeLeft}
        title="לחץ להזמנה">
        <StyledCardMedia
          image={dish.image || placeholderImage}
          isPlaceholder={!dish.image}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {dish.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {dish.description}
          </Typography>
        </CardContent>
      </StyledCardActionArea>

      {(loading || dish.did_user_order_today) && (
        <StyledOverlay>
          {loading ? (
            <StyledProgress size={48} />
          ) : dish.did_user_order_today ? (
            <>
              <StyledCheckIcon />

              {hasTimeLeft && (
                <StyledActionButton
                  right
                  onClick={handleDelete}
                  title="לחץ לביטול ההזמנה">
                  <StyledCancelIcon />
                </StyledActionButton>
              )}
            </>
          ) : null}
        </StyledOverlay>
      )}
    </Card>
  )
}

export default Dish
