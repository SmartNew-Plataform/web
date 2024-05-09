import dayjs from 'dayjs'

interface Props {
  title: string
  data: Array<object>
  filenamePrefix: string
}

export async function exportExcel({ title, data, filenamePrefix }: Props) {
  await fetch('https://excel-api.smartnewsistemas.com.br/exportDefault', {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({
      currencyFormat: [],
      title,
      data,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]))
      const a = document.createElement('a')
      a.href = url
      a.download = `${filenamePrefix}_${dayjs().format('DD-MM-YYYY-HH-mm-ss')}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
    })
    .catch((error) => console.error(error))
}
