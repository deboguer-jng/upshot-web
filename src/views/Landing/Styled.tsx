import styled from '@emotion/styled'
import { Box } from '@upshot-tech/upshot-ui'

export const MiniNFTContainer = styled(Box)`
  display: flex;
  gap: ${({ theme }) => theme.sizes[8] + 'px'};
  padding: ${({ theme }) => theme.sizes[4] + 'px'} 0;
  overflow-x: auto;
  ${({ theme: { scroll } }) => scroll.thin}
`
