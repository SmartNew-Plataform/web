import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabAnalysis } from './tab-analysis'
import { TabBoarding } from './tab-boarding'
import { TabEquipments } from './tab-equipments'
import { TabIdleTime } from './tab-idle-time'
import { TabMaintenance } from './tab-maintenance'
import { TabRoutes } from './tab-routes'
import { TabSpeedLimit } from './tab-speed-limit'
import { TabTimeInside } from './tab-time-inside'
import { TabVehicleUse } from './tab-vehicle-use'

export default function DdmxPage() {
  return (
    <Tabs className="flex h-full w-full flex-col p-4">
      <TabsList defaultValue="equipments" className="self-start bg-slate-200">
        <TabsTrigger value="equipments">Equipamentos</TabsTrigger>
        <TabsTrigger value="routes">Rotas</TabsTrigger>
        <TabsTrigger value="idlePeriodEquipment">
          Períodos ociosos de um veículo
        </TabsTrigger>
        <TabsTrigger value="timeInsideArea">
          Tempo de permanência dentro de áreas
        </TabsTrigger>
        <TabsTrigger value="speedLimit">Excessos de velocidade</TabsTrigger>
        <TabsTrigger value="maintenances">Manutenções</TabsTrigger>
        <TabsTrigger value="vehicleUse">Utilizações</TabsTrigger>
        <TabsTrigger value="boarding">Embarques</TabsTrigger>
        <TabsTrigger value="analysis">Analise</TabsTrigger>
      </TabsList>

      <TabEquipments />
      <TabRoutes />
      <TabIdleTime />
      <TabTimeInside />
      <TabSpeedLimit />
      <TabMaintenance />
      <TabVehicleUse />
      <TabBoarding />
      <TabAnalysis />
    </Tabs>
  )
}
