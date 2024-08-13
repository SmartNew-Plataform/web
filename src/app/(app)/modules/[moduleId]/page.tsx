import { PageWrapper } from '@/components/page-wrapper'

interface PageModuleProps {
  params: {
    moduleId: string
  }
}

export default function PageModule({ params }: PageModuleProps) {
  return (
    <PageWrapper>
      <h1>Module {params.moduleId}</h1>
    </PageWrapper>
  )
}
