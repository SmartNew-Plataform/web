import { Equipment } from '@/@types/ddmx'
import { SelectData } from '@/@types/select-data'
import { api } from '@/lib/api'
import { create } from 'zustand'

interface DdmxData {
  equipments: Equipment[] | undefined
  equipmentData: SelectData[] | undefined

  fetchEquipments: () => Promise<Equipment[]>
}

export const useDdmx = create<DdmxData>((set) => {
  return {
    equipments: undefined,
    equipmentData: undefined,

    async fetchEquipments() {
      const response = await api
        .get<{ automobiles: Equipment[] }>(
          'https://api-gateway.portalddmx.com.br/location/json/listAutomobiles',
          {
            params: {
              login: 'MECBRUN',
              key: '5dfdaafdba8eb8f703cacc400dadad621cf58cbd',
            },
            headers: {
              'x-api-key': '33ef4c41d15f4c393f3e93255abfbfd71bf28511',
            },
          },
        )
        .then((res) => res.data)

      set({
        equipments: response.automobiles,
        equipmentData: response.automobiles.map(({ serial, name }) => ({
          label: name,
          value: serial,
        })),
      })

      return response.automobiles
    },
  }
})
