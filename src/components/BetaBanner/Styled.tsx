import styled from '@emotion/styled'
import { transientOptions } from '@upshot-tech/upshot-ui'

export const BetaBannerBase = styled('div', transientOptions)`
  position: sticky;
  top: 0;
  padding: ${({ theme }) => theme.space[4] + 'px'};
  background: ${({ theme }) => theme.colors['grey-800']};
  width: 100%;
  z-index: ${({ theme }) => theme.zIndex.nav + 2};
`
