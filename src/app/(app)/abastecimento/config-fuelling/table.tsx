'use client'

import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

type FuelConfig = {
  fuelType: string
  selectedOption: string | number
}

export function Table() {
  const [configData, setConfigData] = useState<FuelConfig[] | null>(null)
  const { toast } = useToast()

  async function fetchControlData() {
    try {
      const response = await api.get('fuelling/control')

      if (response.status !== 200) return

      const { filterDay, modelPU } = response.data.data

      setConfigData([
        {
          fuelType: 'Configuração de cálculo abastecimento',
          selectedOption: modelPU || '',
        },
        {
          fuelType: 'Visualização de abastecimentos APP',
          selectedOption: filterDay || 0,
        },
      ])
    } catch (error) {
      console.error('Erro ao buscar dados da API', error)
    }
  }

  useQuery({
    queryKey: ['fuelling/config-fuelling/data'],
    queryFn: fetchControlData,
    retryDelay: 100,
  })

  const handleOptionChange = (index: number, newOption: string | number) => {
    if (configData) {
      const updatedData = configData.map((config, i) =>
        i === index ? { ...config, selectedOption: newOption } : config,
      )
      setConfigData(updatedData)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!configData) return

    const filterDayValue = parseInt(configData[1].selectedOption as string, 10)
    const modelPUValue = configData[0].selectedOption

    const currentDate = new Date().toISOString()

    const payload = {
      filterDay: filterDayValue,
      modelPU: modelPUValue === 'ignorePU' ? null : modelPUValue,
      initialDate: currentDate,
    }

    try {
      const response = await api.post('fuelling/control', payload)

      if (response.status === 201) {
        toast({
          title: 'Configuração salva com sucesso',
          variant: 'success',
        })
      }
    } catch (error) {
      console.error('Erro ao enviar dados', error)
    }
  }

  if (!configData) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-semibold">
          Configurações de Combustível
        </h1>

        <form onSubmit={handleSubmit}>
          {configData.map((config, index) => (
            <div key={index} className="mb-6">
              <h2 className="mb-3 text-lg font-medium">{config.fuelType}</h2>

              {config.fuelType === 'Configuração de cálculo abastecimento' ? (
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`option-${index}`}
                      value="ultima_nota"
                      checked={config.selectedOption === 'ultima_nota'}
                      onChange={() => handleOptionChange(index, 'ultima_nota')}
                      className="mr-3 accent-purple-500"
                    />
                    <span>Calcular P.U da última NF registrada</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`option-${index}`}
                      value="media_nota"
                      checked={config.selectedOption === 'media_nota'}
                      onChange={() => handleOptionChange(index, 'media_nota')}
                      className="mr-3 accent-purple-500"
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
                      className="mr-3 accent-purple-500"
                    />
                    <span>Não considerar P.U</span>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="flex items-center">
                    <span>Informe o número de dias para visualização</span>
                    <input
                      type="number"
                      name={`option-${index}`}
                      value={config.selectedOption}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className="ml-4 w-24 border border-gray-300 p-2"
                    />
                  </label>
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="mt-4 rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  )
}
