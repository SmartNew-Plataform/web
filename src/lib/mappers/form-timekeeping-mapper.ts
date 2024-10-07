import { TimekeepingResponse } from '@/@types/maintenance/timekeeping'
import { TimeKeepingFormData } from '@/app/(app)/manutencao/order-service/[serviceOrderId]/plan-task/form-sheet'
import dayjs from 'dayjs'

export class FormTimeKeepingMapper {
  static toForm(data: TimekeepingResponse): TimeKeepingFormData {
    return {
      collaborator: data.relatedEmployee.id.toString(),
      description: data.description,
      date: dayjs(data.date).format('YYYY-MM-DD'),
      start: dayjs(data.dateStartHour).format('HH:mm'),
      end: dayjs(data.dateEndHour).format('HH:mm'),
      realTime: dayjs(data.realTime.toString()).format('HH:mm'),
      status: data.idStatusServiceOrder?.toString(),
    }
  }
}
