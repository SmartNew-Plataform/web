import { DiverseResponse } from '@/@types/maintenance/diverse'
import { DiverseFormData } from '@/app/(app)/manutencao/order-service/[serviceOrderId]/diverse/form-sheet'
import dayjs from 'dayjs'

export class FormDiversMapper {
  static toForm(data: DiverseResponse): DiverseFormData {
    return {
      description: data.relatedDescriptionCostServiceOrder.id.toString(),
      date: dayjs(data.dateCost).format('YYYY-MM-DD'),
      quantity: Number(data.quantity),
      unitaryValue: Number(data.valueUnit),
      observation: data.comments,
    }
  }
}
