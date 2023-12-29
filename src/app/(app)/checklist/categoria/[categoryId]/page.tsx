import { PageHeader } from '@/components/page-header'
import { PageWrapper } from '@/components/page-wrapper'
import { ListCategoryItem } from './list-category-item'
import { NewCategoryItemModal } from './new-category-item-modal'

interface CategoryItemPageProps {
  params: {
    categoryId: string
  }
}

export default function CategoryItemPage({ params }: CategoryItemPageProps) {
  return (
    <PageWrapper>
      <PageHeader>
        <h1 className="text-xl font-semibold text-slate-600">
          Item de Categoria
        </h1>

        <NewCategoryItemModal categoryId={params.categoryId} />
      </PageHeader>

      <ListCategoryItem categoryId={params.categoryId} />
    </PageWrapper>
  )
}
