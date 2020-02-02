import React from 'react'

import { render, axios } from 'test-utils'
import App from './App'

import { preferencesResponse } from 'mocks/preferences'
import { dishesResponse } from 'mocks/dishes'

test('should render App without crashing', () => {
  // Mock the first 2 requests, which are `/preferences` and `/dishes`
  axios.get
    .mockResolvedValueOnce(preferencesResponse)
    .mockResolvedValueOnce(dishesResponse)

  render(<App />)
})
