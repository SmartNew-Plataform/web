import { ServiceFormData } from '@/app/(app)/manutencao/order-service/service-order-form'

export class ApiServiceOrderMapper {
  static toApi(serviceOrder: ServiceFormData) {
    return {
      idServiceOrderFather: Number(serviceOrder.orderBonded),
      idBranch: Number(serviceOrder.branch),
      idEquipment: Number(serviceOrder.equipment),
      idTypeMaintenance: Number(serviceOrder.typeMaintenance),
      hourMeter: serviceOrder.hourMeter,
      odometer: serviceOrder.odometer,
      descriptionRequest: serviceOrder.equipmentFail,
      comments: serviceOrder.maintenanceDiagnosis,
      observationsExecutor: serviceOrder.executorObservation,
      idStatusServiceOrder: Number(serviceOrder.status),
      dateTimeRequest: new Date(serviceOrder.requestDate).toISOString(),
      dateEquipamentoStop: serviceOrder.stoppedDate
        ? new Date(serviceOrder.stoppedDate).toISOString()
        : undefined,
      dateExpectedEnd: serviceOrder.deadlineDate
        ? new Date(serviceOrder.deadlineDate).toISOString()
        : undefined,
      dateEnd: serviceOrder.closingDate
        ? new Date(serviceOrder.closingDate).toISOString()
        : undefined,
      dueDate: serviceOrder.dueDate
        ? new Date(serviceOrder.dueDate).toISOString()
        : undefined,
      machineStop: serviceOrder.stoppedMachine,
      idRequester: Number(serviceOrder.requester),
      idSectorExecutor: Number(serviceOrder.executantSector),
      maintainers: serviceOrder.maintainers,
      descriptionServicePerformed: serviceOrder.solution,
    }
  }
}
