import configureMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import { axios } from "test-utils"
import { fetchPreferences } from "./preferencesSlice"

const mockStore = configureMockStore([thunk])

test("should convert the fetched preferences array to an object of key-value pairs", async () => {
  axios.get.mockResolvedValueOnce({
    data: [
      { key: "foo", value: 1 },
      { key: "bar", value: "16:00:00" },
    ],
  })

  const store = mockStore({})
  await store.dispatch(fetchPreferences())

  const payload = store.getActions()[0].payload
  const expectedPayload = { foo: 1, bar: "16:00:00" }

  expect(payload).toEqual(expectedPayload)
})
