export const getLocalDateISOString = () => {
  const date = new Date()
  const offsetInMillis = date.getTimezoneOffset() * 60 * 1000
  const localDate = new Date(date - offsetInMillis)
  return localDate.toISOString().slice(0, 10)
}
