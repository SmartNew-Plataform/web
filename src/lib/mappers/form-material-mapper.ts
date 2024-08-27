import { MaterialResponse } from '@/@types/maintenance/material'
import { MaterialFormData } from '@/app/(app)/manutencao/order-service/[serviceOrderId]/material/form-sheet'
import dayjs from 'dayjs'

export class FormMaterialMapper {
  static toForm(data: MaterialResponse): MaterialFormData {
    return {
      description: data.idMaterial.toString(),
      quantity: Number(data.quantity),
      unitaryValue: data.valueUnit,
      dateUse: dayjs(data.dateUse).format('YYYY-MM-DD'),
      serialNumberOld: data.serialNumberOld,
      serialNumberNewer: data.serialNumberNew,
      observation: data.comments,
    }
  }
}
