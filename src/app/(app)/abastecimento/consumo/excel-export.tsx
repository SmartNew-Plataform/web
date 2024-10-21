const recordHeader = `[
  {
    "nameHeader":"EQUIPAMENTO",
    "formatHeader":{
      "border":1,
      "bold": true,
      "align":"center",
      "text_wrap": true
    }
  },
  {
    "nameHeader":"TIPO CONSUMO",
    "formatHeader":{
      "text_wrap": true,
      "border":1,
      "bold": true,
      "text_wrap": true,
      "valign":"center",
      "align":"center"
      
    }
  },
  {
    "nameHeader":"QTD LITROS",
    "formatHeader":{
      "border":1,
      "bold": true,
      "align":"center",
      "valign":"center",
      "text_wrap": true
    }
  },
  {
    "nameHeader":"VLR TOTAL",
    "formatHeader":{
      "border":1,
      "bold": true,
      "align":"center",
      "valign":"center",
      "text_wrap": true
    }
  },
  {
    "nameHeader":"TOTAL CONTADOR",
    "formatHeader":{
      "border":1,
      "bold": true,
      "align":"center",
      "valign":"center",
      "text_wrap": true
    }
  },
  {
    "nameHeader":"CONS. PREVISTO",
    "formatHeader":{
      "border":1,
      "bold": true,
      "align":"center",
      "valign":"center",
      "text_wrap": true
    }
  },
  {
    "nameHeader":"CONS. REALIZADO",
    "formatHeader":{
      "border":1,
      "bold": true,
      "align":"center",
      "valign":"center",
      "text_wrap": true
    }
  },
  {
    "nameHeader":"DIFERENÇA %",
    "formatHeader":{
      "border":1,
      "bold": true,
      "align":"center",
      "valign":"center",
      "text_wrap": true
    }
  }
]
`

const recordsFormat = `[
  {"border": 1},
  {"border": 1},
  {"border": 1, "num_format": 4},
  {"border": 1, "num_format": 4},
  {"border": 1, "num_format": 4},
  {"border": 1, "num_format": 4},
  {"border": 1, "num_format": 4},
  {"border": 1, "num_format": 10}
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
}