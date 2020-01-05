import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Providers from './Providers'
import 'api/axios'

const customRender = (ui, options) =>
  render(ui, { wrapper: Providers, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
