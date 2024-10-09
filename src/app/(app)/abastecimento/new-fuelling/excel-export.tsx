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
        sheets: [sheets]
    }
}

export function createBody(sheets:any):any{
    const before = bodyBefore(sheets)
    return JSON.stringify(before)
        .replaceAll('"###recordHeader###"',recordHeader)
        .replaceAll('"###recordsFormat###"',recordsFormat)
}