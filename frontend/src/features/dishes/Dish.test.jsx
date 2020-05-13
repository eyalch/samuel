import { dish, dishForTomorrow } from "mocks/dishes"
import React from "react"
import store from "store"
import { render } from "test-utils"
import Dish from "./Dish"
import { setHasTimeLeft } from "./dishesSlice"

const unorderedDish = { ...dish, orders_count: 0 }
const orderedDish = { ...dish, orders_count: 1 }

// Set the `hasTimeLeft` to `true` for convenience
beforeEach(() => {
  store.dispatch(setHasTimeLeft(true))
})

// Reset the store
afterEach(() => {
  store.dispatch(setHasTimeLeft(false))
})

test("should display the dish name and description", () => {
  const { queryByText } = render(<Dish dish={dish} />)

  expect(queryByText(dish.name)).toBeInTheDocument()
  expect(queryByText(dish.description)).toBeInTheDocument()
})

describe("Placeholder image", () => {
  test("should be shown when an image isn't provided", () => {
    const _dish = { ...dish, image: "" }
    const { queryByTestId } = render(<Dish dish={_dish} />)

    expect(queryByTestId("dish-image")).toHaveClass("placeholder")
  })

  test("should not be shown when an image is provided", () => {
    const { queryByTestId } = render(<Dish dish={dish} />)

    expect(queryByTestId("dish-image")).not.toHaveClass("placeholder")
  })
})

describe('"Order" button', () => {
  test("should be shown if there are dishes left", async () => {
    const _dish = { ...unorderedDish, has_dishes_left: true }
    const { queryByText, findByText } = render(<Dish dish={_dish} />)

    expect(queryByText("להזמנה")).toBeInTheDocument()
    store.dispatch(setHasTimeLeft(false))
    expect(await findByText("להזמנה")).toBeInTheDocument()
  })

  test("should not be shown if there are no dishes left", () => {
    const _dish = { ...unorderedDish, has_dishes_left: false }
    const { queryByText } = render(<Dish dish={_dish} />)

    expect(queryByText("להזמנה")).not.toBeInTheDocument()
    store.dispatch(setHasTimeLeft(false))
    expect(queryByText("להזמנה")).not.toBeInTheDocument()
  })

  test("should be shown if the dish is not for today", async () => {
    const { queryByText, findByText } = render(<Dish dish={dishForTomorrow} />)

    expect(queryByText("להזמנה")).toBeInTheDocument()
    store.dispatch(setHasTimeLeft(false))
    expect(await findByText("להזמנה")).toBeInTheDocument()
  })
})

describe('"Cancel" button', () => {
  test("should not be shown if the dish is not ordered", () => {
    const { queryByText } = render(<Dish dish={unorderedDish} />)

    expect(queryByText("ביטול")).not.toBeInTheDocument()
  })

  test("should be shown if the dish is ordered", () => {
    const { queryByText } = render(<Dish dish={orderedDish} />)

    expect(queryByText("ביטול")).toBeInTheDocument()
    store.dispatch(setHasTimeLeft(false))
    expect(queryByText("ביטול")).toBeInTheDocument()
  })
})

describe('"Order Another" button', () => {
  test("should not be shown if the dish is not ordered", () => {
    const { queryByText } = render(<Dish dish={unorderedDish} />)

    expect(queryByText("להזמנה נוספת")).not.toBeInTheDocument()
  })

  test("should be shown if the dish is ordered and there are dishes left", async () => {
    const _dish = { ...orderedDish, has_dishes_left: true }
    const { queryByText, findByText } = render(<Dish dish={_dish} />)

    expect(queryByText("להזמנה נוספת")).toBeInTheDocument()
    store.dispatch(setHasTimeLeft(false))
    expect(await findByText("להזמנה נוספת")).toBeInTheDocument()
  })

  test("should be shown when there are no dishes left only when there is time left and as disabled", () => {
    const _dish = { ...orderedDish, has_dishes_left: false }
    const { queryByText } = render(<Dish dish={_dish} />)

    expect(queryByText("להזמנה נוספת")).toBeInTheDocument()
    expect(queryByText("להזמנה נוספת")).toBeDisabled()
    store.dispatch(setHasTimeLeft(false))
    expect(queryByText("להזמנה נוספת")).not.toBeInTheDocument()
  })
})

describe("Ordered dish check-marks", () => {
  test("should show 0 check-marks if dish is not ordered", () => {
    const _dish = { ...dish, orders_count: 0 }
    const { queryAllByTestId } = render(<Dish dish={_dish} />)

    expect(queryAllByTestId("check-mark")).toHaveLength(0)
  })

  test("should show 1 check-mark if dish was ordered once", () => {
    const _dish = { ...dish, orders_count: 1 }
    const { queryAllByTestId } = render(<Dish dish={_dish} />)

    expect(queryAllByTestId("check-mark")).toHaveLength(1)
  })

  test("should show 2 check-marks if dish was ordered twice", () => {
    const _dish = { ...dish, orders_count: 2 }
    const { queryAllByTestId } = render(<Dish dish={_dish} />)

    expect(queryAllByTestId("check-mark")).toHaveLength(2)
  })
})
