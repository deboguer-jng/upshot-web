import styled from '@emotion/styled'
import { Box } from '@upshot-tech/upshot-ui'

export const MiniNFTContainer = styled(Box)`
  display: flex;
  margin-bottom: ${({ theme }) => theme.sizes[3] + 'px'};
  gap: ${({ theme }) => theme.sizes[7] + 'px'};
  padding-bottom: ${({ theme }) => theme.sizes[5] + 'px'};
  overflow-x: auto;
  ${({ theme: { scroll } }) => scroll.thin}

  @media (min-width: ${({ theme }) => theme.breakpoints[1]}) {
    &::-webkit-scrollbar-thumb,
    & *::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) => theme.colors.transparent};
    }

    &:hover {
      &::-webkit-scrollbar-thumb,
      & *::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.colors['grey-700']};
      }
    }
  }

  &::after {
    display: block;
    content: '';
    min-width: 86px;
  }
`
