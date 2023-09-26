import { HeaderApp } from './header-app'

export default function LayoutApp({ children }: { children: React.ReactNode }) {
  return <HeaderApp>{children}</HeaderApp>
}
