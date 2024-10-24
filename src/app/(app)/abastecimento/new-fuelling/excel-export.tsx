import { formatTableTopStyle, formatHeaderStyle } from '@/lib/exportExcelStyles'

const headers = `[
  {
    "blocks":[
      {
        "message":"Registro de Abastecimentos",
        "colBegin":"A1",
        "colEnd":"E1",
        "format":{
         ${formatHeaderStyle}
       }
      }
    ]
  }###filterDate###
]
`

const recordHeader = `[
    { 
      "nameHeader":"Id"
    },
    {
      "nameHeader":"Posto"
    },
    {
      "nameHeader":"Data de abertura"
    },
    {
      "nameHeader":"Equipamento"
    },
    {
      "nameHeader":"Tipo consumo"
    },
    {
      "nameHeader":"Contador atual"
    },
    {
      "nameHeader":"Contador anterior"
    },
    {
      "nameHeader":"Combustível"
    },
    {
      "nameHeader":"Quantidade"
    },
    {
      "nameHeader":"Consumo realizado"
    },
    {
    "nameHeader":"Valor unitário"
    },
    {
    "nameHeader":"Valor total"
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
    .replaceAll('"###formatTableTop###"', formatTableTopStyle)
}
