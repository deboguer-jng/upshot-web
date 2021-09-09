import styled from '@emotion/styled'
import { Box } from '@upshot-tech/upshot-ui'

export const MiniNFTContainer = styled(Box)`
  ${({ theme: { scroll } }) => scroll.thin}

  display: flex;
  margin-bottom: ${({ theme }) => theme.sizes[3] + 'px'};
  gap: ${({ theme }) => theme.sizes[7] + 'px'};
  padding-bottom: ${({ theme }) => theme.sizes[5] + 'px'};
  overflow-x: auto;

  &::after {
    display: block;
    content: '';
    min-width: 86px;
  }
`
