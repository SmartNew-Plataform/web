import { DiverseFormData } from '@/app/(app)/manutencao/order-service/[serviceOrderId]/diverse/form-sheet'

export class ApiDiverseMapper {
  static toApi(data: DiverseFormData) {
    return {
      idDescriptionCost: Number(data.description),
      quantity: data.quantity,
      valueUnit: data.unitaryValue,
      cost: Number(data.quantity) * Number(data.unitaryValue),
      dateCost: new Date(data.date).toISOString(),
      comments: data.observation,
    }
  }
}
