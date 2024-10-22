import React, { useEffect, useState } from 'react';
import { useServiceOrder, ServiceOrder, StatusFilterData } from '@/store/maintenance/service-order';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import { useQueryClient } from '@tanstack/react-query';
import { FiCheckCircle, FiAlertCircle, FiPauseCircle, FiPlus, FiCheck, FiInfo, FiMail, FiLock, FiSettings, FiHelpCircle } from 'react-icons/fi'; 
import { useRouter, useSearchParams } from 'next/navigation';
import Modal from 'react-modal';

// Mapeia status com as cores associadas
const statusColors: { [key: string]: string } = {
  'EM ABERTO': 'border-red-500',
  'DISPONIVEL': 'border-green-500',
  'EM ANDAMENTO': 'border-yellow-500',
  'AUDITORIA': 'border-blue-500',
  'ENCERRADO': 'border-black-500',
  'AUSÊNCIA DE MATERIAL': 'border-orange-500',
  'REPROVADO': 'border-red-500',
  'EM MANUTENÇÃO EXTERNA': 'border-purple-500',
};

// Ícones com base nos status
const statusIcons: { [key: string]: React.ReactNode } = {
  'EM ABERTO': <FiAlertCircle className="text-red-500" />,
  'DISPONIVEL': <FiCheckCircle className="text-green-500" />,
  'EM ANDAMENTO': <FiPauseCircle className="text-yellow-500" />,
  'AUDITORIA': <FiMail className="text-blue-500" />,
  'ENCERRADO': <FiLock className="text-black-500" />,
  'AUSÊNCIA DE MATERIAL': <FiHelpCircle className="text-orange-500" />,
  'REPROVADO': <FiAlertCircle className="text-red-500" />,
  'EM MANUTENÇÃO EXTERNA': <FiSettings className="text-purple-500" />
};

const KanbanView = () => {
  const { serviceOrders, fetchServiceOrders, updateServiceOrderStatus, selects } = useServiceOrder();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  const [newStatusId, setNewStatusId] = useState<number | null>(null);
  const [justify, setJustify] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string | null>(null);

  useEffect(() => {
    fetchServiceOrders();
  }, [fetchServiceOrders]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
  
    const orderId = parseInt(draggableId);
    const newStatusId = parseInt(destination.droppableId);

    if (destination.droppableId !== source.droppableId) {
      const newStatus = selects.status?.find(status => status.id === newStatusId.toString());

      if (newStatus?.hasJustify || newStatus?.hasFinished) {
        setCurrentOrderId(orderId);
        setNewStatusId(newStatusId);
        setIsModalOpen(true);
      } else {
        updateServiceOrderStatus(orderId, newStatusId).then(() => {
          queryClient.refetchQueries(['maintenance-service-order-table']);
        });
      }
    }
  };

  const openOrderDetails = (orderId: number) => {
    if (searchParams && searchParams.get('token')) {
      router.push(
        `/manutencao/order-service/${orderId}/details?token=${searchParams.get('token')}&h=hidden`
      );
    }
  };


  const handleModalSubmit = () => {
    if (currentOrderId && newStatusId !== null) {
      updateServiceOrderStatus(currentOrderId, newStatusId, { justify, dateEnd }).then(() => {
        queryClient.refetchQueries(['maintenance-service-order-table']);
        closeModal();
      });
    }
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setJustify('');
    setDateEnd(null);
  };

  const groupedOrders: { [key: string]: ServiceOrder[] } = serviceOrders
    ? serviceOrders.reduce((acc, order) => {
        const statusId = order.statusOrderService.id.toString();
        if (!acc[statusId]) {
          acc[statusId] = [];
        }
        acc[statusId].push(order);
        return acc;
      }, {} as { [key: string]: ServiceOrder[] })
    : {};

  const mapSelectDataToStatusFilter = (selectData: any[]): StatusFilterData[] => {
    return selectData.map((status) => ({
      id: status.value || status.id,
      name: status.label || status.name,
      color: status.color || '#eaeff5',
      hasFinished: status.hasFinished || false,
      hasJustify: status.hasJustify || false,
      count: 0,
    }));
  };

  const statusList = selects.status ? mapSelectDataToStatusFilter(selects.status) : [];

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 p-5 overflow-x-auto bg-white bg-opacity-90 rounded-lg">
          {statusList.map((status: StatusFilterData) => (
            <Droppable key={status.id} droppableId={status.id.toString()}>
              {(provided: DroppableProvided) => (
                <div
                  className="min-w-[280px] flex flex-col bg-transparent gap-2"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-gray-900 font-bold text-md flex items-center gap-2">
                      {statusIcons[status.name] || <FiCheckCircle className="text-gray-500" />}
                      {status.name}
                    </div>
                    <FiPlus className="text-black cursor-pointer hover:text-gray-600" />
                  </div>
                  <div className="flex flex-col gap-4">
                    {groupedOrders[status.id] && groupedOrders[status.id].map((order, index) => (
                      <Draggable key={order.id.toString()} draggableId={order.id.toString()} index={index}>
                        {(provided: DraggableProvided) => (
                          <div
                            className={`bg-white rounded-lg p-3 shadow-md cursor-grab flex flex-col gap-3 border-l-4 ${statusColors[status.name]}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="flex justify-between items-center">
                              <p className="text-gray-700 text-xs"><strong>OS:</strong> {order.codeServiceOrder}</p>
                              <div className="text-right">
                                <FiCheck className="text-green-500 cursor-pointer hover:text-green-700"/>
                                <FiInfo className="text-blue-500 cursor-pointer hover:text-blue-700" onClick={() => openOrderDetails(order.id)} />
                              </div>
                            </div>
                            <p className="text-gray-700 text-xs"><strong>Cliente:</strong> {order.branch.companyName}</p>
                            <p className="text-gray-700 text-xs"><strong>Equipamento:</strong> {order.equipment}</p>
                            <p className="text-gray-700 text-xs"><strong>Data Programada:</strong> {order.datePrev}</p>
                            <p className="text-gray-700 text-xs"><strong>Data de Emissao:</strong> {order.dateEmission}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Preencher Justificativa e Data">
        <h2>Preencha os detalhes</h2>
        <label>
          Justificativa:
          <input
            type="text"
            value={justify}
            onChange={(e) => setJustify(e.target.value)}
          />
        </label>
        <label>
          Data de Encerramento:
          <input
            type="datetime-local"
            value={dateEnd || ''}
            onChange={(e) => setDateEnd(e.target.value)}
          />
        </label>
        <button onClick={handleModalSubmit}>Enviar</button>
        <button onClick={closeModal}>Cancelar</button>
      </Modal>
    </>
  );
};

export default KanbanView;
