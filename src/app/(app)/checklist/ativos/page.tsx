import { PageHeader } from '@/components/page-header'
import { PageWrapper } from '@/components/page-wrapper'
import { CreateActiveForm } from './create-active-form'
import { Table } from './table'

export default function ActivePage() {
  return (
    <PageWrapper>
      <PageHeader>
        <h1 className="text-xl font-semibold text-slate-600">
          Equipamentos Ativos
        </h1>

        <CreateActiveForm />
      </PageHeader>

      <Table />
    </PageWrapper>
  )
}
