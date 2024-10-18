const headers = `[
        {
          "blocks":[
            {
              "message":"Cadastro de Tanques",
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
      "nameHeader":"TAG",
      "formatHeader":{
        "border":1,
        "bold": true,
        "align":"center"
      }
    },
    {
      "nameHeader":"Descrição",
      "formatHeader":{
        "align":"center",
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"Capacidade máxima",
      "formatHeader":{
        "align":"center",
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"Filial",
      "formatHeader":{
        "align":"center",
        "border":1,
        "bold": true
      }
    },
    {
      "nameHeader":"Combustível",
      "formatHeader":{
        "align":"center",
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
    {}
  ]
`

function bodyBefore(sheets: any): any {
  return {
    filename: 'Planilha.xlsx',
    sheets: [sheets],
  }
}

function createFilterDate(startDate:string, endDate:string){
  if ( startDate == null || endDate == null ) return '';
//"message":"PERÍODO: ${startDate} Á ${endDate}",
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

export function createBody(sheets:any, startDate:string, endDate: string):any{

  const filterDate = createFilterDate(startDate,endDate)
  const headersWithFilterDate = headers.replace("###filterDate###",filterDate)

  const before = bodyBefore(sheets)
  return JSON.stringify(before)
    .replaceAll('"###headers###"', headersWithFilterDate)
    .replaceAll('"###recordHeader###"', recordHeader)
    .replaceAll('"###recordsFormat###"', recordsFormat)
}
