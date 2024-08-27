import { FailureAnalysisFormData } from '@/app/(app)/manutencao/order-service/[serviceOrderId]/failure-analysis/form-sheet'

export class ApiFailureAnalysisMapper {
  static toApi(data: FailureAnalysisFormData) {
    return {
      idComponent: Number(data.component),
      idSymptom: Number(data.symptom),
      idCause: Number(data.cause),
      idAction: Number(data.action),
    }
  }
}
