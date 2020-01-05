import React from 'react'
import axiosMock from 'axios'

import { render } from 'test-utils'
import App from './App'

import { preferencesResponse } from 'api/mocks/preferences'
import { dishesResponse } from 'api/mocks/dishes'

jest.mock('axios')

test('should render App without crashing', () => {
  // Mock the first 2 requests, which are `/preferences` and `/dishes`
  axiosMock.get
    .mockResolvedValueOnce(preferencesResponse)
    .mockResolvedValueOnce(dishesResponse)

  render(<App />)
})
