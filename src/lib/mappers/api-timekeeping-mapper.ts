import { TimeKeepingFormData } from '@/app/(app)/manutencao/order-service/[serviceOrderId]/timekeeping/form-sheet'
import dayjs from 'dayjs'

export class ApiTimeKeepingMapper {
  static toApi(data: TimeKeepingFormData) {
    return {
      // idClient: data.,
      // idBranch: data.,
      // idEquipment: data.,
      idEmployee: Number(data.collaborator),
      description: data.description,
      // comments: data.,
      // tasks: data.,
      date: new Date(data.date).toUTCString(),
      dateStartHour: dayjs()
        .hour(Number(data.start?.split(':')[0]))
        .minute(Number(data.start?.split(':')[1]))
        .toDate()
        .toUTCString(),
      dateEndHour: dayjs()
        .hour(Number(data.end?.split(':')[0]))
        .minute(Number(data.end?.split(':')[1]))
        .toDate()
        .toUTCString(),
      // finished: dayjs().get('hours'),
      // typeMaintenance: data.,
      // idProject: data.,
      idStatusServiceOrder: Number(data.status),
      // aux: data.g
    }
  }
}
