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

const formatTableTop = `{
   "text_wrap": true,
      "bold": true,
      "text_wrap": true,
      "valign":"center",
      "align":"center",
      "bg_color": "#e2e8f0",
      "font_color": "#64748b"
}`

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

function bodyBefore(sheets:any):any{
  return {
      filename:"Análise de consumo.xlsx",
      sheets: sheets 
  }
}

function createFilterDate(sheets:any, startDate:string, endDate:string){
  if ( startDate == null || endDate == null ) 
    return sheets

  console.log(Array.isArray(sheets))
  console.log(sheets)
  console.log(typeof(sheets))
  let filterDate = "PERÍODO "+String(startDate)+" Á "+String(endDate)
  const filterDate2 = "Relatório de Composições"

  filterDate = filterDate.replaceAll('/','-')
  console.log(typeof(filterDate)) // string
  console.log(typeof(filterDate2)) // string
  const newFirstSheet = { "sheetName": filterDate }
  console.log(typeof(sheets))
  //`PERÍODO: ${startDate} Á ${endDate}`
  sheets.unshift(newFirstSheet); 
  return sheets
}


export function createBody(sheets:any, startDate:string, endDate: string):any{

  const sheetsWhitfilterDate = createFilterDate(sheets, startDate, endDate)
  
  const before = bodyBefore(sheetsWhitfilterDate)
  return JSON.stringify(before)
      .replaceAll('"###recordHeader###"',recordHeader)
      .replaceAll('"###recordsFormat###"',recordsFormat)
      .replaceAll('"###formatTableTop###"',formatTableTop)
}