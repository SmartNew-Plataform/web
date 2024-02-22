import { PageWrapper } from '@/components/page-wrapper'
import { CreateEmissionForm } from './create-emission-form'

export default function New() {
  return (
    <PageWrapper className="flex h-screen w-screen">
      <CreateEmissionForm />
    </PageWrapper>
  )
}
