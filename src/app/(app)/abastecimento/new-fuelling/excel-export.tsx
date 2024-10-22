const headers = `[
  {
    "blocks":[
      {
        "message":"Registro de Abastecimentos",
        "colBegin":"A1",
        "colEnd":"E1",
       "format":{
        "bold":1,
        "align":"center",
        "font_size": 13
       }
      }
    ]
  }###filterDate###
]
`

const recordHeader = `[
    {
      "nameHeader":"Id",
      "formatHeader":{
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"Posto",
      "formatHeader":{
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"Data de abertura",
      "formatHeader":{
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"Equipamento",
      "formatHeader":{
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"Tipo consumo",
      "formatHeader":{
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"Contador atual",
      "formatHeader":{
         "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"Contador anterior",
      "formatHeader":{
         "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"Combustível",
      "formatHeader":{
         "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"Quantidade",
      "formatHeader":{
         "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"Consumo realizado",
      "formatHeader":{
        "border":1,
        "bold": true
      }
    },
    {
    "nameHeader":"Valor unitário",
      "formatHeader":{
        "border":1,
        "bold": true
      }
    },
    {
    "nameHeader":"Valor total",
      "formatHeader":{
        "border":1,
        "bold": true
      }
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
    {"num_format": 2},
    {"num_format": 2},
    {},
    {"num_format": 2},
    {"num_format": 2},
    {"num_format": 2},
    {"num_format": 2}
  ]
`

function bodyBefore(sheets: unknown): unknown {
  return {
    filename: 'Planilha.xlsx',
    sheets: [sheets],
  }
}

function createFilterDate(startDate: string, endDate: string) {
  if (startDate == null || endDate == null) return ''

  return `,
    {
    "blocks":[
      {
        "message":"PERÍODO: ${startDate} Á ${endDate}",
        "colBegin":"A2",
        "colEnd":"E2",
       "format":{
        
       }
      }
    ]
  }
    `
}

export function createBody(
  sheets: unknown,
  startDate: string,
  endDate: string,
): string {
  const filterDate = createFilterDate(startDate, endDate)
  const headersWithFilterDate = headers.replace('###filterDate###', filterDate)

  const before = bodyBefore(sheets)
  return JSON.stringify(before)
    .replaceAll('"###headers###"', headersWithFilterDate)
    .replaceAll('"###recordHeader###"', recordHeader)
    .replaceAll('"###recordsFormat###"', recordsFormat)
}
