import './monkeyFetch'

export const GET = url => fetch(url)

export const POST = (url, body) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

export const DELETE = url => fetch(url, { method: 'DELETE' })
