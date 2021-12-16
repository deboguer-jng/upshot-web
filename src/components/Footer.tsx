import { Footer as FooterUI } from '@upshot-tech/upshot-ui'
import { useAppSelector } from 'redux/hooks'
import { selectShowSidebar } from 'redux/reducers/layout'
import { FlexProps } from 'theme-ui'

export const Footer = (props: FlexProps) => {
  const showSidebar = useAppSelector(selectShowSidebar)

  return <FooterUI sidebarVisible={showSidebar} {...props} />
}
