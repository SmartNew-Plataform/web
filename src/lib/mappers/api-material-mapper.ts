import { MaterialFormData } from '@/app/(app)/manutencao/order-service/[serviceOrderId]/material/form-sheet'

export class ApiMaterialMapper {
  static toApi(data: MaterialFormData) {
    return {
      idMaterial: Number(data.description),
      quantity: data.quantity,
      dateUse: new Date(data.dateUse).toISOString(),
      valueUnit: data.unitaryValue,
      serialNumberOld: data.serialNumberOld,
      serialNumberNew: data.serialNumberNewer,
      comments: data.observation,
    }
  }
}
