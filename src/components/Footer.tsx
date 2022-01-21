import { Footer as FooterUI, FooterProps } from '@upshot-tech/upshot-ui'
import { useAppSelector } from 'redux/hooks'
import { selectShowSidebar } from 'redux/reducers/layout'

export const Footer = (props: FooterProps) => {
  const showSidebar = useAppSelector(selectShowSidebar)

  return <FooterUI sidebarVisible={showSidebar} {...props} />
}
