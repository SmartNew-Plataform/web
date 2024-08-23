import { StopRecordingFormData } from '@/app/(app)/manutencao/order-service/[serviceOrderId]/stop-recording/form-sheet'
import dayjs from 'dayjs'

export class ApiStopRecordingMapper {
  static toApi(data: StopRecordingFormData) {
    return {
      dateEndHour: dayjs(data.dateStop).toISOString(),
      dateStartHour: dayjs(data.dateWorked).toISOString(),
      comments: data.observation,
    }
  }
}
