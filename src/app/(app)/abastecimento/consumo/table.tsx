import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function AnaliseConsumoPorFrota() {
  const data = [
    {
      categoria: 'Caminhão Basculante',
      itens: [
        {
          equipamento: 'CB-001 MERCEDES 2730',
          tipoConsumo: 'LT/HR',
          qtdLitros: '1.368,00',
          vlrTotal: '8.481,60',
          totalContador: '100,00',
          consPrevisto: '16,00',
          consRealizado: '13,68',
          diferenca: '-0,15 %',
        },
        {
          equipamento: 'CB-002 MERCEDES 4144',
          tipoConsumo: 'LT/HR',
          qtdLitros: '1.700,00',
          vlrTotal: '10.540,00',
          totalContador: '120,00',
          consPrevisto: '16,00',
          consRealizado: '14,17',
          diferenca: '-0,11 %',
        },
        {
          equipamento: 'CB-004 SCANIA 560',
          tipoConsumo: 'LT/HR',
          qtdLitros: '2.300,00',
          vlrTotal: '14.260,00',
          totalContador: '120,00',
          consPrevisto: '16,00',
          consRealizado: '19,17',
          diferenca: '0,20 %',
        },
      ],
    },
    {
      categoria: 'Escavadeira Hidráulica',
      itens: [
        {
          equipamento: 'EH-001 CATERPILLAR 336D',
          tipoConsumo: 'LT/HR',
          qtdLitros: '2.600,00',
          vlrTotal: '16.120,00',
          totalContador: '75,00',
          consPrevisto: '30,00',
          consRealizado: '34,67',
          diferenca: '10,16 %',
        },
        {
          equipamento: 'EH-006 NEW HOLLAND 380',
          tipoConsumo: 'LT/HR',
          qtdLitros: '2.450,00',
          vlrTotal: '15.190,00',
          totalContador: '90,00',
          consPrevisto: '33,00',
          consRealizado: '27,22',
          diferenca: '-0,18 %',
        },
        {
          equipamento: 'EH-009 VOLVO EC220',
          tipoConsumo: 'LT/HR',
          qtdLitros: '2.900,00',
          vlrTotal: '17.980,00',
          totalContador: '150,00',
          consPrevisto: '33,00',
          consRealizado: '19,33',
          diferenca: '-0,02 %',
        },
      ],
    },
    {
      categoria: 'Pá Carregadeira',
      itens: [
        {
          equipamento: 'PC-001 CATERPILLAR 336D',
          tipoConsumo: 'LT/HR',
          qtdLitros: '2.600,00',
          vlrTotal: '16.120,00',
          totalContador: '130,00',
          consPrevisto: '19,00',
          consRealizado: '20,00',
          diferenca: '0,05 %',
        },
        {
          equipamento: 'PC-006 NEW HOLLAND 380',
          tipoConsumo: 'LT/HR',
          qtdLitros: '2.450,00',
          vlrTotal: '15.190,00',
          totalContador: '120,00',
          consPrevisto: '16,00',
          consRealizado: '12,89',
          diferenca: '-0,50 %',
        },
        {
          equipamento: 'PC-009 VOLVO EC220',
          tipoConsumo: 'LT/HR',
          qtdLitros: '2.900,00',
          vlrTotal: '17.980,00',
          totalContador: '150,00',
          consPrevisto: '19,00',
          consRealizado: '19,33',
          diferenca: '0,02 %',
        },
      ],
    },
  ]

  return (
    <div className="container mx-auto p-4">
      {data.map((grupo, index) => (
        <div key={index} className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">{grupo.categoria}</h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-2">Equipamento</TableHead>
                <TableHead className="px-4 py-2">Tipo Consumo</TableHead>
                <TableHead className="px-4 py-2">Qtd Litros</TableHead>
                <TableHead className="px-4 py-2">Vlr Total</TableHead>
                <TableHead className="px-4 py-2">Total Contador</TableHead>
                <TableHead className="px-4 py-2">Cons. Previsto</TableHead>
                <TableHead className="px-4 py-2">Cons. Realizado</TableHead>
                <TableHead className="px-4 py-2">Diferença %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grupo.itens.map((item, idx) => (
                <TableRow key={idx} className="hover:bg-gray-100">
                  <TableCell className="border px-4 py-2">
                    {item.equipamento}
                  </TableCell>
                  <TableCell className="border px-4 py-2">
                    {item.tipoConsumo}
                  </TableCell>
                  <TableCell className="border px-4 py-2">
                    {item.qtdLitros}
                  </TableCell>
                  <TableCell className="border px-4 py-2">
                    {item.vlrTotal}
                  </TableCell>
                  <TableCell className="border px-4 py-2">
                    {item.totalContador}
                  </TableCell>
                  <TableCell className="border px-4 py-2">
                    {item.consPrevisto}
                  </TableCell>
                  <TableCell className="border px-4 py-2">
                    {item.consRealizado}
                  </TableCell>
                  <TableCell
                    className={`border px-4 py-2 ${parseFloat(item.diferenca) >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {item.diferenca}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}

      <div className="mt-8">
        <Table>
          {/* <TableCaption>Total Geral</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Total Geral</TableHead>
              <TableHead className="border px-4 py-2">21.268,00</TableHead>
              <TableHead className="border px-4 py-2">131.861,60</TableHead>
              <TableHead className="border px-4 py-2">1.125,00</TableHead>
              <TableHead className="border px-4 py-2">16,00</TableHead>
              <TableHead className="border px-4 py-2">15,67</TableHead>
              <TableHead className="border px-4 py-2">-0,02 %</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
    </div>
  )
}
