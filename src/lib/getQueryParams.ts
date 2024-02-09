interface Props {
  [key: string]: string | string[]
}

export function getQueryParams(queries: Props) {
  const url = new URLSearchParams()

  Object.entries(queries).forEach(([key, value]) => {
    if (typeof value === 'object') {
      url.append(key, encodeURIComponent(JSON.stringify(value)))
    } else {
      url.append(key, value)
    }
  })

  return url.toString()
}
