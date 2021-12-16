import { Footer as FooterUI } from '@upshot-tech/upshot-ui'
import { useAppSelector } from 'redux/hooks'
import { selectShowSidebar } from 'redux/reducers/layout'

export const Footer = () => {
  const showSidebar = useAppSelector(selectShowSidebar)

  return <FooterUI sidebarVisible={showSidebar} />
}
