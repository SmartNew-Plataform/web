const recordHeader = `[
    {
      "nameHeader":"EQUIPAMENTO",
      "formatHeader":{
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"TIPO CONSUMO",
      "formatHeader":{
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"QTD LITROS",
      "formatHeader":{
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"VLR TOTAL",
      "formatHeader":{
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"TOTAL CONTADOR",
      "formatHeader":{
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"CONS. PREVISTO",
      "formatHeader":{
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"CONS. REALIZADO",
      "formatHeader":{
         "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"DIFERENÇA %",
      "formatHeader":{
         "border":1,
        "bold": true
      }
    }
  ]
`

const recordsFormat = `[
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {}
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