import { PageWrapper } from '@/components/page-wrapper'

export default function IframePage() {
  return (
    <PageWrapper>
      <iframe
        src="http://scriptcase.smartnewservices.com.br/sistemas/blank_IntegraReact?tokenUser=a2be186c45cd4c9be5cb847767053dee&blank=blank_compras_grid"
        className="h-full w-full"
        frameborder="0"
      ></iframe>
    </PageWrapper>
  )
}
