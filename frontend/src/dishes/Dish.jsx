import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import DoneOutlineIcon from '@material-ui/icons/DoneOutline'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { useDishes } from './DishesProvider'
import placeholderImage from './placeholder.png'

const StyledCard = styled(Card)`
  position: relative;
`
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
  display: flex;
  justify-content: space-around;
  justify-content: space-evenly;
  align-items: center;
  padding: 0 ${p => p.theme.spacing(1)}px;
`
const StyledOrderedIcon = styled(DoneOutlineIcon)`
  height: auto;
  max-width: 40%;
  width: 100%;
  flex-shrink: 1;
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
  ${StyledCard}:hover & {
    transform: translateX(0);
  }

  ${p => p.theme.breakpoints.only('xs')} {
    transform: translateX(0);
  }

  svg {
    font-size: 50px;
    display: block;
  }
`

const Dish = ({ dish }) => {
  const [loading, setLoading] = useState(false)

  const { orderDish, cancelOrder, hasTimeLeft } = useDishes()

  const onOrder = async () => {
    if (!hasTimeLeft) return

    setLoading(true)
    await orderDish(dish.id)
    setLoading(false)
  }

  const onDelete = async () => {
    if (!hasTimeLeft) return

    setLoading(true)
    await cancelOrder(dish.id)
    setLoading(false)
  }

  const isOrdered = dish.orders_count > 0

  return (
    <StyledCard component="li">
      <StyledCardActionArea
        onClick={onOrder}
        disabled={loading || isOrdered || !hasTimeLeft}
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

      {(loading || isOrdered) && (
        <StyledOverlay>
          {loading ? (
            <CircularProgress size={72} />
          ) : (
            // Show an icon for every order of the dish
            Array(dish.orders_count)
              .fill()
              .map((_, i) => <StyledOrderedIcon key={i} />)
          )}
        </StyledOverlay>
      )}

      {!loading && isOrdered && hasTimeLeft && (
        <>
          <StyledActionButton right onClick={onDelete} title="ביטול הזמנה">
            <RemoveCircleIcon />
          </StyledActionButton>
          <StyledActionButton left onClick={onOrder} title="הזמנת מנה לאורח">
            <AddCircleIcon />
          </StyledActionButton>
        </>
      )}
    </StyledCard>
  )
}

export default Dish
