import "@testing-library/jest-dom/extend-expect"
import { render } from "@testing-library/react"
import "api/axios"
import axios from "axios"
import "mocks/localStorage"
import Providers from "./Providers"

jest.mock("axios")

const customRender = (ui, options) =>
  render(ui, { wrapper: Providers, ...options })

// re-export everything
export * from "@testing-library/react"
// override render method
export { customRender as render, axios }
