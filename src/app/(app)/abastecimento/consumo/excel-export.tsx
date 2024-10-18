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
  {"border": 1},
  {"border": 1},
  {"border": 1},
  {"border": 1},
  {"border": 1},
  {"border": 1}
]
`

function bodyBefore(sheets:any):any{
  return {
      filename:"Planilha.xlsx",
      sheets: sheets 
  }
}

export function createBody(sheets:any):any{
  const before = bodyBefore(sheets)
  return JSON.stringify(before)
      .replaceAll('"###recordHeader###"',recordHeader)
      .replaceAll('"###recordsFormat###"',recordsFormat)
}