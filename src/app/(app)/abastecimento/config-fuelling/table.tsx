'use client'

import { useState } from 'react'

type FuelConfig = {
  fuelType: string
  selectedOption: 'lastInvoice' | 'averageTwoInvoices' | 'ignorePU'
}

const initialData: FuelConfig[] = [
  {
    fuelType: 'Configuração de abastecimento',
    selectedOption: 'lastInvoice',
  },
]

export function Table() {
  const [configData, setConfigData] = useState<FuelConfig[]>(initialData)

  const handleOptionChange = (
    index: number,
    newOption: 'lastInvoice' | 'averageTwoInvoices' | 'ignorePU',
  ) => {
    const updatedData = configData.map((config, i) =>
      i === index ? { ...config, selectedOption: newOption } : config,
    )
    setConfigData(updatedData)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {configData.map((config, index) => (
          <div key={index} className="rounded-lg border p-4 shadow">
            <h2 className="mb-2 text-lg font-semibold">{config.fuelType}</h2>
            <div>
              <div className="mb-2">
                <input
                  type="radio"
                  name={`option-${index}`}
                  value="lastInvoice"
                  checked={config.selectedOption === 'lastInvoice'}
                  onChange={() => handleOptionChange(index, 'lastInvoice')}
                  className="mr-2"
                />
                Calcular P.U da última NF registrada
              </div>
              <div className="mb-2">
                <input
                  type="radio"
                  name={`option-${index}`}
                  value="averageTwoInvoices"
                  checked={config.selectedOption === 'averageTwoInvoices'}
                  onChange={() =>
                    handleOptionChange(index, 'averageTwoInvoices')
                  }
                  className="mr-2"
                />
                Calcular média do P.U das últimas duas NFs registradas
              </div>
              <div>
                <input
                  type="radio"
                  name={`option-${index}`}
                  value="ignorePU"
                  checked={config.selectedOption === 'ignorePU'}
                  onChange={() => handleOptionChange(index, 'ignorePU')}
                  className="mr-2"
                />
                Não considerar P.U
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
