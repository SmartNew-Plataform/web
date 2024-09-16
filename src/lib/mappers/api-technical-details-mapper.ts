import { TechnicalDetailsFormData } from '@/app/(app)/manutencao/order-service/[serviceOrderId]/technical-details/form'

export class ApiTechnicalDetailsMapper {
  static toApi(data: TechnicalDetailsFormData) {
    return {
      ...data,
    }
  }
}
