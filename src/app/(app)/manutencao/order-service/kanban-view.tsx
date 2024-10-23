import { Field } from '@/components/form/field'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  ServiceOrder,
  StatusFilterData,
  useServiceOrder,
} from '@/store/maintenance/service-order'
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
  FiCheck,
  FiCheckCircle,
  FiHelpCircle,
  FiInfo,
  FiLock,
  FiMail,
  FiPauseCircle,
  FiPlus,
  FiSettings,
} from 'react-icons/fi'
// import Modal from 'react-modal'

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

  useEffect(() => {
    fetchServiceOrders()
  }, [fetchServiceOrders])

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return

    const orderId = parseInt(draggableId)
    const newStatusId = parseInt(destination.droppableId)

    if (destination.droppableId !== source.droppableId) {
      const draggedOrder = statusList?.find(
        ({ id }) => id === destination.droppableId,
      )
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
      updateServiceOrderStatus(currentOrderId, newStatusId, {
        justify,
        dateEnd,
      }).then(() => {
        queryClient.refetchQueries(['maintenance-service-order-table'])
        closeModal()
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
    }))
  }

  const statusList = selects.status
    ? mapSelectDataToStatusFilter(selects.status)
    : []

  console.log(statusList)

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-auto rounded-lg bg-white bg-opacity-90 p-5 border border-gray-400 h-full">
          {statusList.map((status: StatusFilterData) =>
            status.id ? (
              <Droppable key={status.id} droppableId={status.id.toString()}>
                {(provided: DroppableProvided) => (
                  <div
                    className="relative overflow-auto flex min-w-[300px] flex-col gap-5 bg-transparent border-r border-gray-300 min-h-full"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="p-3 flex items-center justify-between sticky top-0 bg-white">
                      <div className="text-md flex items-center gap-2 font-bold text-gray-900 ">
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
                                    <strong>OS:</strong>{' '}
                                    {order.codeServiceOrder}
                                  </p>
                                  <div className="text-right">
                                    <FiInfo
                                      className="cursor-pointer text-blue-500 hover:text-blue-700"
                                      onClick={() => openOrderDetails(order.id)}
                                    />
                                  </div>
                                </div>
                                <p className="text-xs text-gray-700">
                                  <strong>Cliente:</strong>{' '}
                                  {order.branch.companyName}
                                </p>
                                <p className="text-xs text-gray-700">
                                  <strong>Equipamento:</strong>{' '}
                                  {order.equipment}
                                </p>
                                <p className="text-xs text-gray-700">
                                  <strong>Data Programada:</strong>{' '}
                                  {order.datePrev}
                                </p>
                                <p className="text-xs text-gray-700">
                                  <strong>Data de Emissao:</strong>{' '}
                                  {order.dateEmission}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <h2>Preencha os detalhes</h2>
          <Field>
            <Label>
            Justificativa:
              
            </Label>
            <Input
              type="text"
              value={justify}
              onChange={(e) => setJustify(e.target.value)}
              className="input-class"
            />
          </Field>
          <Field>
            <Label>
            Data de Encerramento:

            </Label>
            <Input
              type="datetime-local"
              value={dateEnd || ''}
              onChange={(e) => setDateEnd(e.target.value)}
              className="input-class"
            />
          </Field>
          <Button onClick={handleModalSubmit}>Enviar</Button>
        </DialogContent>
      </Dialog>
      {/* <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Justificativa e Data de Encerramento"
        className="modal-class"
        overlayClassName="overlay-class"
      >
      </Modal> */}
    </>
  )
}

export default KanbanView
