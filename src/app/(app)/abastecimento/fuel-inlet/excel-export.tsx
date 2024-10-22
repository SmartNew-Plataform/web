const headers = `[
        {
          "blocks":[
            {
              "message":"Registro de Entradas",
              "colBegin":"A1",
              "colEnd":"F1",
             "format":{
              "bold":1,
              "align":"center",
              "font_size": 13
             }
            }
          ]
        }
]
`
const formatTableTop = `{
     "text_wrap": true,
     "bold": true,
     "text_wrap": true,
     "valign":"center",
     "align":"center",
     "bg_color": "#e2e8f0",
     "font_color": "#64748b"
}`

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
    .replaceAll('"###formatTableTop###"', formatTableTop)
}
