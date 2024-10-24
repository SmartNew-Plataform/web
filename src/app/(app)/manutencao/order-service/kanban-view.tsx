import { Field } from '@/components/form/field'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  ServiceOrder,
  StatusFilterData,
  useServiceOrder,
} from '@/store/maintenance/service-order'
import { AdvancedFilter } from '@/components/advanced-filter'
import { Label } from '@radix-ui/react-label'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DropResult,
  Droppable,
  DroppableProvided,
} from 'react-beautiful-dnd'
import {
  FiAlertCircle,
  FiCheckCircle,
  FiHelpCircle,
  FiInfo,
  FiLock,
  FiMail,
  FiPauseCircle,
  FiPlus,
  FiSettings,
} from 'react-icons/fi'
import { useFilters } from '@/hooks/use-filters'

const statusColors: { [key: string]: string } = {
  'EM ABERTO': 'border-red-500',
  DISPONIVEL: 'border-green-500',
  'EM ANDAMENTO': 'border-yellow-500',
  AUDITORIA: 'border-blue-500',
  ENCERRADO: 'border-black-500',
  'AUSÊNCIA DE MATERIAL': 'border-orange-500',
  REPROVADO: 'border-red-500',
  'EM MANUTENÇÃO EXTERNA': 'border-purple-500',
}

const statusIcons: { [key: string]: React.ReactNode } = {
  'EM ABERTO': <FiAlertCircle className="text-red-500" />,
  DISPONIVEL: <FiCheckCircle className="text-green-500" />,
  'EM ANDAMENTO': <FiPauseCircle className="text-yellow-500" />,
  AUDITORIA: <FiMail className="text-blue-500" />,
  ENCERRADO: <FiLock className="text-black-500" />,
  'AUSÊNCIA DE MATERIAL': <FiHelpCircle className="text-orange-500" />,
  REPROVADO: <FiAlertCircle className="text-red-500" />,
  'EM MANUTENÇÃO EXTERNA': <FiSettings className="text-purple-500" />,
}

const KanbanView = () => {
  const {
    serviceOrders,
    fetchServiceOrders,
    updateServiceOrderStatus,
    selects,
  } = useServiceOrder()
  const queryClient = useQueryClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null)
  const [newStatusId, setNewStatusId] = useState<number | null>(null)
  const [justify, setJustify] = useState<string>('')
  const [dateEnd, setDateEnd] = useState<string | null>(null)
  const [draggedOrderData, setDraggedOrderData] = useState<StatusFilterData | null>(null)

  // Novo hook para gerenciar filtros
  const filterServiceOrder = useFilters({
    defaultValues: { status: selects.status ? [selects.status[0].value] : [] },
    options: [
      {
        label: 'Ordem',
        value: 'codeServiceOrder',
        type: 'text',
      },
      {
        label: 'Cliente',
        value: 'branch.companyName',
        type: 'text',
      },
      {
        label: 'Equipamento',
        value: 'equipment',
        type: 'select',
        options: selects.equipment,
      },
      {
        label: 'Solicitante',
        value: 'requester',
        type: 'select',
        options: selects.requester,
      },
      {
        label: 'Status',
        value: 'status',
        type: 'select',
        options: selects?.status?.map(({id, name}) => {
          return {
            label: name,
            value: id
          }
        })
      },
    ],
  })

  const { filterData } = filterServiceOrder

  useEffect(() => {
  
    if (selects.status && selects.status.length > 0) {
      if (Object.keys(filterData).length > 0) {
        fetchServiceOrders(filterData);
      } else {
        fetchServiceOrders();
      }
    }
  }, [fetchServiceOrders, filterData, selects]);
  

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return

    const orderId = parseInt(draggableId)
    const newStatusId = parseInt(destination.droppableId)

    if (destination.droppableId !== source.droppableId) {
      const draggedOrder = statusList?.find(
        ({ id }) => id === destination.droppableId,
      )

      if (draggedOrder) {
        setDraggedOrderData(draggedOrder)
      }

      console.log(draggedOrder?.hasJustify, draggedOrder?.hasFinished)

      if (draggedOrder?.hasJustify || draggedOrder?.hasFinished) {
        setCurrentOrderId(orderId)
        setNewStatusId(newStatusId)
        setIsModalOpen(true)
      } else {
        updateServiceOrderStatus(orderId, newStatusId).then(() => {
          queryClient.refetchQueries(['maintenance-service-order-table'])
        })
      }
    }
  }

  const openOrderDetails = (orderId: number) => {
    if (searchParams && searchParams.get('token')) {
      router.push(
        `/manutencao/order-service/${orderId}/details?token=${searchParams.get('token')}&h=hidden`,
      )
    }
  }

  const handleModalSubmit = () => {
    if (currentOrderId && newStatusId !== null) {
      const formattedDateEnd = dateEnd ? new Date(dateEnd).toISOString() : undefined
  
      const additionalData = {
        justify: draggedOrderData?.hasJustify ? justify : undefined,
        dateEnd: draggedOrderData?.hasFinished ? formattedDateEnd : undefined,
      }
  
      updateServiceOrderStatus(currentOrderId, newStatusId, additionalData)
        .then(() => {
          queryClient.refetchQueries(['maintenance-service-order-table'])
          closeModal()
        })
        .catch(error => {
          console.error('Erro ao atualizar o status da ordem de serviço:', error)
        })
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setJustify('')
    setDateEnd(null)
  }

  const groupedOrders: { [key: string]: ServiceOrder[] } = serviceOrders
    ? serviceOrders.reduce(
        (acc, order) => {
          const statusId = order.statusOrderService.id.toString()
          if (!acc[statusId]) {
            acc[statusId] = []
          }
          acc[statusId].push(order)
          return acc
        },
        {} as { [key: string]: ServiceOrder[] },
      )
    : {}

  const mapSelectDataToStatusFilter = (
    selectData: any[],
  ): StatusFilterData[] => {
    return selectData.map((status) => ({
      id: status.value || status.id,
      name: status.label || status.name,
      color: status.color || '#eaeff5',
      hasFinished: status.hasFinished,
      hasJustify: status.hasJustify,
      count: 0,
      value: status.id
    }))
  }

  const statusList = selects.status
    ? mapSelectDataToStatusFilter(selects.status)
    : []

  console.log(statusList)

  return (
    <>
      <div className="flex flex-col gap-4">
        <AdvancedFilter {...filterServiceOrder} />

        <div className="flex-1 overflow-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 overflow-x-auto overflow-y-hidden rounded-lg bg-white bg-opacity-90 p-5 border border-gray-400 h-full">
              {statusList.map((status: StatusFilterData) =>
                status.id ? (
                  <Droppable key={status.id} droppableId={status.id.toString()}>
                    {(provided: DroppableProvided) => (
                      <div
                        className="flex min-w-[280px] flex-col gap-2 bg-transparent"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-md flex items-center gap-2 font-bold text-gray-900">
                            {statusIcons[status.name] || (
                              <FiCheckCircle className="text-gray-500" />
                            )}
                            {status.name}
                          </div>
                          <FiPlus className="cursor-pointer text-black hover:text-gray-600" />
                        </div>
                        <div className="flex flex-col gap-4">
                          {groupedOrders[status.id] &&
                            groupedOrders[status.id].map((order, index) => (
                              <Draggable
                                key={order.id.toString()}
                                draggableId={order.id.toString()}
                                index={index}
                              >
                                {(provided: DraggableProvided) => (
                                  <div
                                    className={`flex cursor-grab flex-col gap-3 rounded-lg border-l-4 bg-white p-3 shadow-md ${statusColors[status.name]}`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <div className="flex items-center justify-between">
                                      <p className="text-xs text-gray-700">
                                        <strong>OS:</strong> {order.codeServiceOrder}
                                      </p>
                                      <div className="text-right">
                                        <FiInfo
                                          className="cursor-pointer text-blue-500 hover:text-blue-700"
                                          onClick={() => openOrderDetails(order.id)}
                                        />
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-700">
                                      <strong>Cliente:</strong>{' '} {order.branch.companyName}
                                    </p>
                                    <p className="text-xs text-gray-700">
                                      <strong>Equipamento:</strong>{' '}  {order.equipment}
                                    </p>
                                    <p className="text-xs text-gray-700">
                                      <strong>Data Programada:</strong>{' '}  {order.datePrev}
                                    </p>
                                    <p className="text-xs text-gray-700">
                                      <strong>Data de Emissão:</strong>{' '}  {order.dateEmission}
                                    </p>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                ) : null,
              )}
            </div>
          </DragDropContext>
        </div>
      </div>
  
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <h2>Preencha os detalhes</h2>
          {draggedOrderData?.hasJustify && (
            <Field>
              <Label>Justificativa:</Label>
              <Input
                type="text"
                value={justify}
                onChange={(e) => setJustify(e.target.value)}
                className="input-class"
              />
            </Field>
          )}
          {draggedOrderData?.hasFinished && (
            <Field>
              <Label>Data de Encerramento:</Label>
              <Input
                type="date"
                value={dateEnd || ''}
                onChange={(e) => setDateEnd(e.target.value)}
                className="input-class"
              />
            </Field>
          )}
          <Button onClick={handleModalSubmit}>Enviar</Button>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default KanbanView
