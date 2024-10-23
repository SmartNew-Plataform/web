import { formatTableTopStyle, formatHeaderStyle } from '@/lib/exportExcelStyles'

const headers = `[
        {
          "blocks":[
            {
              "message":"Registro de Entradas",
              "colBegin":"A1",
              "colEnd":"F1",
              "format":{
                ${formatHeaderStyle}
              }
            }
          ]
        }
]
`

const recordHeader = `[
    {
      "nameHeader":"DATA"
    },
    {
      "nameHeader":"TIPO"
    },
    {
      "nameHeader":"Nº DCTO"
    },
    {
      "nameHeader":"EQUIPAMENTO ABASTECIDO"
    },
    {
      "nameHeader":"FORNECEDOR"
    },
    {
      "nameHeader":"VALOR TOTAL"
    }
  ]
`
// Verificar a quantidade de recordFormat, recordHeader e records tem que ser igual
const recordsFormat = `[
    {},
    {},
    {},
    {},
    {},
    {"num_format":4}
  ]
`

function bodyBefore(sheets: unknown): unknown {
  return {
    filename: 'Planilha.xlsx',
    sheets: [sheets],
  }
}

export function createBody(sheets: unknown): string {
  const before = bodyBefore(sheets)

  return JSON.stringify(before)
    .replaceAll('"###headers###"', headers)
    .replaceAll('"###recordHeader###"', recordHeader)
    .replaceAll('"###recordsFormat###"', recordsFormat)
    .replaceAll('"###formatTableTop###"', formatTableTopStyle)
}
