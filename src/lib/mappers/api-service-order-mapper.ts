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
      dateTimeRequest: new Date(serviceOrder.requestDate).toUTCString(),
      dateEquipamentoStop: serviceOrder.stoppedDate
        ? new Date(serviceOrder.stoppedDate).toUTCString()
        : undefined,
      dateExpectedEnd: serviceOrder.deadlineDate
        ? new Date(serviceOrder.deadlineDate).toUTCString()
        : undefined,
      dateEnd: serviceOrder.closingDate
        ? new Date(serviceOrder.closingDate).toUTCString()
        : undefined,
      dueDate: serviceOrder.dueDate
        ? new Date(serviceOrder.dueDate).toUTCString()
        : undefined,
      machineStop: serviceOrder.stoppedMachine,
      idRequester: Number(serviceOrder.requester),
      idSectorExecutor: Number(serviceOrder.executantSector),
      maintainers: serviceOrder.maintainers,
      descriptionServicePerformed: serviceOrder.solution,
    }
  }
}
