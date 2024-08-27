import { FailureAnalysisResponse } from '@/@types/maintenance/failure-analysis'
import { FailureAnalysisFormData } from '@/app/(app)/manutencao/order-service/[serviceOrderId]/failure-analysis/form-sheet'

export class FormFailureAnalysis {
  static toForm(data: FailureAnalysisResponse): FailureAnalysisFormData {
    return {
      component: data.relatedComponent.id.toString(),
      symptom: data.relatedFailureSymptoms.id.toString(),
      cause: data.relatedFailureCause.id.toString(),
      action: data.relatedFailureAction.id.toString(),
    }
  }
}
