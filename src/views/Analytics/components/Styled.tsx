import styled from '@emotion/styled'
import { Box } from '@upshot-tech/upshot-ui'

export const MiniNFTContainer = styled(Box)`
  display: flex;
  margin-bottom: ${({ theme }) => theme.sizes[3] + 'px'};
  gap: ${({ theme }) => theme.sizes[7] + 'px'};
  padding-bottom: ${({ theme }) => theme.sizes[5] + 'px'};
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints[1]}) {
    &:hover {
      overflow-x: auto;
      ${({ theme: { scroll } }) => scroll.thin}
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    overflow-x: auto;
    ${({ theme: { scroll } }) => scroll.thin}
  }

  &::after {
    display: block;
    content: '';
    min-width: 86px;
  }
`
