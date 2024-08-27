import { PageWrapper } from '@/components/page-wrapper'

interface ServiceOrderProps {
  params: {
    serviceOrderId: string
  }
}

export default function ServiceOrderPage({ params }: ServiceOrderProps) {
  return (
    <PageWrapper>
      <div>{params.serviceOrderId}</div>
    </PageWrapper>
  )
}
