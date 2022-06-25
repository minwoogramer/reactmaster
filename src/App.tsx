import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import styled, { ThemeProvider } from "styled-components";
import Router from "./Router";
import { Container } from "./styled/Container";
import GlobalStyle from "./styled/GlobalStyle";
import { darkTheme, lightTheme } from './styled/theme';
import { faLightbulb, faMoon } from "@fortawesome/free-solid-svg-icons";
import { HelmetProvider } from "react-helmet-async";
import { useLatest } from "react-use";
import { useRecoilValue } from "recoil";

const queryClient = new QueryClient();

const FloatingButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  right: 0;
  top: 0;
  margin: 20px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  color: ${(props) => props.theme.bgColor};
  background-color: ${(props) => props.theme.textColor};
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${(props) => (props.theme.name === "light") ? darkTheme.accentColor : lightTheme.accentColor};
  }
`;

function isPreferringDarkMode() {
  if (window.matchMedia("(prefers-color-scheme: dark)")?.matches) {
    return true;
  }

  return false;
}

function App() {
  const isInitPreferDarkMode = useMemo(isPreferringDarkMode, []);
  const [theme, setTheme] = useState(isInitPreferDarkMode ? darkTheme : lightTheme);
  const latestTheme = useLatest(theme);

  const onClickDarkModeButton = () => {
    setTheme((theme) => theme.name === "light" ? darkTheme : lightTheme);
  };

  useEffect(() => {
    const listener = (event: MediaQueryListEvent) => {
      if (event.matches) {
        if (latestTheme.current !== darkTheme) {
          setTheme(darkTheme);
        }
      } else {
        if (latestTheme.current !== lightTheme) {
          setTheme(lightTheme);
        }
      }
    };

    window.matchMedia("(prefers-color-scheme: dark)")?.addEventListener("change", listener);

    return () => {
      window.matchMedia("(prefers-color-scheme: dark)")?.removeEventListener("change", listener);
    };
  }, [latestTheme]);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <ThemeProvider theme={theme}>
        
            <GlobalStyle/>
          
            <Container>
              <Router/>
            </Container>
            <FloatingButton onClick={onClickDarkModeButton}>
              <FontAwesomeIcon icon={theme.name === "light" ? faMoon : faLightbulb}/>
            </FloatingButton>
            
            <ReactQueryDevtools/>
          </ThemeProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
