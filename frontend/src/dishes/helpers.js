export const getLocalDateISOString = (date = new Date()) => {
  const offsetInMillis = date.getTimezoneOffset() * 60 * 1000
  const localDate = new Date(date - offsetInMillis)
  return localDate.toISOString().slice(0, 10)
}

export const getPrettyWeekday = targetDateStr => {
  const targetDate = new Date(targetDateStr)
  const targetDateISO = getLocalDateISOString(targetDate)

  const todayDateISO = getLocalDateISOString(new Date())

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowDateISO = getLocalDateISOString(tomorrow)

  switch (targetDateISO) {
    case todayDateISO:
      return 'היום'
    case tomorrowDateISO:
      return 'מחר'
    default:
      return targetDate.toLocaleDateString('he', { weekday: 'long' })
  }
}
