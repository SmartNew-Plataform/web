'use client'

import { useState } from 'react'

type FuelConfig = {
  fuelType: string
  selectedOption: string
}

const initialData: FuelConfig[] = [
  {
    fuelType: 'Configuração de cálculo abastecimento',
    selectedOption: 'lastInvoice',
  },
  {
    fuelType: 'Visualização de abastecimentos APP',
    selectedOption: 'today',
  },
]

export function Table() {
  const [configData, setConfigData] = useState<FuelConfig[]>(initialData)

  const handleOptionChange = (index: number, newOption: string) => {
    const updatedData = configData.map((config, i) =>
      i === index ? { ...config, selectedOption: newOption } : config,
    )
    setConfigData(updatedData)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-semibold">
          Configurações de Combustível
        </h1>

        {configData.map((config, index) => (
          <div key={index} className="mb-6">
            <h2 className="mb-3 text-lg font-medium">{config.fuelType}</h2>

            {/* Condicional para diferenciar entre os dois grupos de opções */}
            {config.fuelType === 'Configuração de cálculo abastecimento' ? (
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`option-${index}`}
                    value="lastInvoice"
                    checked={config.selectedOption === 'lastInvoice'}
                    onChange={() => handleOptionChange(index, 'lastInvoice')}
                    className="mr-3 accent-blue-500"
                  />
                  <span>Calcular P.U da última NF registrada</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`option-${index}`}
                    value="averageTwoInvoices"
                    checked={config.selectedOption === 'averageTwoInvoices'}
                    onChange={() =>
                      handleOptionChange(index, 'averageTwoInvoices')
                    }
                    className="mr-3 accent-blue-500"
                  />
                  <span>
                    Calcular média do P.U das últimas duas NFs registradas
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`option-${index}`}
                    value="ignorePU"
                    checked={config.selectedOption === 'ignorePU'}
                    onChange={() => handleOptionChange(index, 'ignorePU')}
                    className="mr-3 accent-blue-500"
                  />
                  <span>Não considerar P.U</span>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`option-${index}`}
                    value="today"
                    checked={config.selectedOption === 'today'}
                    onChange={() => handleOptionChange(index, 'today')}
                    className="mr-3 accent-blue-500"
                  />
                  <span>Abastecimentos realizados hoje</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`option-${index}`}
                    value="week"
                    checked={config.selectedOption === 'week'}
                    onChange={() => handleOptionChange(index, 'week')}
                    className="mr-3 accent-blue-500"
                  />
                  <span>Abastecimentos realizados durante a semana</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`option-${index}`}
                    value="month"
                    checked={config.selectedOption === 'month'}
                    onChange={() => handleOptionChange(index, 'month')}
                    className="mr-3 accent-blue-500"
                  />
                  <span>Abastecimentos realizados no mês</span>
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
