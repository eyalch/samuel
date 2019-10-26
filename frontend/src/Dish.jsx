import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import styled from 'styled-components'
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

const Dish = ({ dish }) => {
  return (
    <Card component="li">
      <StyledCardActionArea>
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
    </Card>
  )
}

export default Dish
