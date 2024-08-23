import { StopRecordingResponse } from '@/@types/maintenance/stop-recording'
import { StopRecordingFormData } from '@/app/(app)/manutencao/order-service/[serviceOrderId]/stop-recording/form-sheet'
import dayjs from 'dayjs'

export class FormStopRecodingMapper {
  static toForm(data: StopRecordingResponse): StopRecordingFormData {
    return {
      dateStop: dayjs(data.dateStartHour).format('YYYY-MM-DDTHH:mm'),
      dateWorked: dayjs(data.dateEndHour).format('YYYY-MM-DDTHH:mm'),
      observation: data.comments,
    }
  }
}
