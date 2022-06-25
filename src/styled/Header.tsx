import { darken } from "polished";
import styled, { DefaultTheme, keyframes } from "styled-components";

const glowing = (props: { theme: DefaultTheme }) => keyframes`
  0% {
    color: ${props.theme.textColor};
  }
  25% {
    color: ${props.theme.accentColor};
  }
  75% {
    color: ${props.theme.accentColor};
  }
  100% {
    color: ${props.theme.textColor};
  }
`;

export const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 12px;
  background-color: ${(props) => darken(0.1, props.theme.bgColor)};
`;

export const HeaderToolbarContainer = styled.div`
  width: 100%;
`;

export const Title = styled.h1`
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  color: ${(props) => props.theme.textColor};
  animation: ${glowing} 5s ease 1s infinite;
`;
