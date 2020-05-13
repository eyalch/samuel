import { dishesResponse } from "mocks/dishes"
import { preferencesResponse } from "mocks/preferences"
import React from "react"
import { axios, render } from "test-utils"
import App from "./App"

test("should render App without crashing", () => {
  // Mock the first 2 requests, which are `/preferences` and `/dishes`
  axios.get
    .mockResolvedValueOnce(preferencesResponse)
    .mockResolvedValueOnce(dishesResponse)

  render(<App />)
})
