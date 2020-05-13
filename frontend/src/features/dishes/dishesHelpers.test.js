import { getLocalDateISOString, getPrettyWeekday } from "./dishesHelpers"

describe("getLocalDateISOString", () => {
  test("should the given date as an ISO date", () => {
    const date = new Date(2020, 1, 3) // February 3, 2020
    expect(getLocalDateISOString(date)).toBe("2020-02-03")
  })
})

describe("getPrettyWeekday", () => {
  test("today", () => {
    expect(getPrettyWeekday(new Date())).toBe("היום")
  })

  test("tomorrow", () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    expect(getPrettyWeekday(tomorrow)).toBe("מחר")
  })

  test("should return the correct weekday in Hebrew", () => {
    // 2017-01-01 was a Sunday
    expect(getPrettyWeekday(new Date(2017, 0, 1))).toBe("יום ראשון")
    expect(getPrettyWeekday(new Date(2017, 0, 2))).toBe("יום שני")
    expect(getPrettyWeekday(new Date(2017, 0, 3))).toBe("יום שלישי")
    expect(getPrettyWeekday(new Date(2017, 0, 4))).toBe("יום רביעי")
    expect(getPrettyWeekday(new Date(2017, 0, 5))).toBe("יום חמישי")
    expect(getPrettyWeekday(new Date(2017, 0, 6))).toBe("יום שישי")
    expect(getPrettyWeekday(new Date(2017, 0, 7))).toBe("יום שבת")
  })
})
