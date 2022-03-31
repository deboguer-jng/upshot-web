import css from '@emotion/css'
import styled from '@emotion/styled'
import { Link } from '@upshot-tech/upshot-ui'

export const SidebarShade = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  animation: ${({ theme }) => theme.animations.fadeIn};
  z-index: ${({ theme }) => theme.zIndex.nav};

  ${({ theme }) => css`
    @media only screen and (min-width: ${theme.breakpoints[1]}) {
      width: 400px;
      background: linear-gradient(
        -90deg,
        rgba(0, 0, 0, 0.85) 60%,
        rgba(0, 0, 0, 0) 100%
      );
    }
  `}
`

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 264px;
  height: calc(100vh - 264px);
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.nav + 2};
  text-align: center;
  width: 100%;
  animation: ${({ theme }) => theme.animations.fadeIn};
  overflow-y: auto;

  ${({ theme }) => css`
    @media only screen and (min-width: ${theme.breakpoints[1]}) {
      width: auto;
      text-align: right;
      top: 164px;
      height: calc(100vh - 164px);
      left: auto;
      right: 80px;
    }
  `}
`

export const SideLink = styled(Link)<{ $isActive?: boolean }>`
  color: ${({ theme, $isActive }) =>
    theme.colors[$isActive ? 'primary' : 'grey-400']};
  text-decoration: none !important;
  transition: ${({ theme }) => theme.transitions.default};
  font-size: 2rem;

  &:hover {
    color: ${({ theme, $isActive }) =>
      theme.colors[$isActive ? 'primary' : 'white']};
  }
`
