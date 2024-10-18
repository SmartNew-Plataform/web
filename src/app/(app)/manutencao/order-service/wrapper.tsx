'use client'

import { useServiceOrder } from '@/store/maintenance/service-order'
import { KanbanView } from './kanban-view'
import { TableServiceOrder } from './table-service-order'

export function Wrapper() {
  const { viewMode } = useServiceOrder()

  if (viewMode === 'kanban') return <KanbanView />

  return <TableServiceOrder />
}
