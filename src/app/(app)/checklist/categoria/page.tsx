import { PageHeader } from '@/components/page-header'
import { PageWrapper } from '@/components/page-wrapper'
import { NewGroupModal } from './new-group-modal'
import { ListGroups } from './list-groups'

export default function CategoriaPage() {
  return (
    <PageWrapper>
      <PageHeader>
        <h1 className="text-xl font-semibold text-slate-600">Categorias</h1>

        <NewGroupModal />
      </PageHeader>

      <ListGroups />
    </PageWrapper>
  )
}
