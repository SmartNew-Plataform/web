const recordHeader = `[
    {
      "nameHeader":"Equipamento",
      "formatHeader":{
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"Tipo de consumo",
      "formatHeader":{
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"Quantidade de Litros",
      "formatHeader":{
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"Valor Total",
      "formatHeader":{
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"Consumo previsto",
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
      "nameHeader":"Diferença %",
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
    {"num_format": "#,##0.00"},
    {"num_format": "#,##0.00"},
    {"num_format": "#,##0.00"},
    {},
    {"num_format" : 10}
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