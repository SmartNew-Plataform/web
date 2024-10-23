import { formatTableTopStyle } from '@/lib/exportExcelStyles'

const recordHeader = `[
  {
    "nameHeader":"EQUIPAMENTO"
  },
  {
    "nameHeader":"TIPO CONSUMO"
  },
  {
    "nameHeader":"QTD LITROS"
  },
  {
    "nameHeader":"VLR TOTAL"
  },
  {
    "nameHeader":"TOTAL CONTADOR"
  },
  {
    "nameHeader":"CONS. PREVISTO"
  },
  {
    "nameHeader":"CONS. REALIZADO"
  },
  {
    "nameHeader":"DIFERENÇA %"
  }
]
`
const recordsFormat = `[
  {},
  {},
  {"num_format": 4},
  {"num_format": 4},
  {"num_format": 4},
  {"num_format": 4},
  {"num_format": 4},
  {"num_format": 10}
]
`

function bodyBefore(sheets: unknown): unknown {
  return {
    filename: 'Análise de consumo.xlsx',
    sheets,
  }
}

function createFilterDate(sheets: unknown, startDate: string, endDate: string) {
  if (startDate == null || endDate == null) return sheets

  let filterDate = `PERÍODO ${startDate} Á ${endDate}`

  filterDate = filterDate.replaceAll('/', '-')
  const newFirstSheet = { sheetName: filterDate }

  if (Array.isArray(sheets)) {
    sheets.unshift(newFirstSheet)
  }
  return sheets
}

export function createBody(
  sheets: unknown,
  startDate: string,
  endDate: string,
): string {
  const sheetsWhitfilterDate = createFilterDate(sheets, startDate, endDate)

  const before = bodyBefore(sheetsWhitfilterDate)
  return JSON.stringify(before)
    .replaceAll('"###recordHeader###"', recordHeader)
    .replaceAll('"###recordsFormat###"', recordsFormat)
    .replaceAll('"###formatTableTop###"', formatTableTopStyle)
}
