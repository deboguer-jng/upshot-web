import styled from '@emotion/styled'
import { Box } from '@upshot-tech/upshot-ui'

export const MiniNFTContainer = styled(Box)`
  display: flex;
  margin: ${({ theme }) => `${theme.sizes[8]}px 0 ${theme.sizes[6]}px 0`};
  gap: ${({ theme }) => theme.sizes[2] + 'px'};
  padding-bottom: ${({ theme }) => theme.sizes[4] + 'px'};
  overflow-x: auto;
  ${({ theme: { scroll } }) => scroll.thin}
`
