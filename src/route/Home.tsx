import { useQuery } from "react-query";

import styled from "styled-components";
import { fetchCoins } from "../query/coin-api";
import { Header, HeaderToolbarContainer, Title } from "../styled/Header";
import { Loader } from "../styled/Loader";
import { Main } from "../styled/Main";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const CoinList = styled.ul``;

const CoinIcon = styled.img`
  width: 32px;
  height: 32px;
`;

const CoinContent = styled.div``;

const Coin = styled.li`
  margin-top: 10px;
  border: 1px solid ${(props) => props.theme.textColor};
  border-radius: 16px;
  background-color: ${(props) => props.theme.bgColor};
  box-shadow: 2px 4px 6px -4px ${(props) => props.theme.textColor};
  transition: all 0.2s ease;
  
  & > a {
    display: flex;
    align-items: center;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  
    & > ${CoinContent} {
      margin-left: 8px;
    }
  
    &:hover {
      color: ${(props) => props.theme.accentColor};
      transform: translate(12px);
    }
  }
`;


function getCoinIconUrl(coinSymbol: string) {
  return `https://coinicons-api.vercel.app/api/icon/${coinSymbol.toLowerCase()}`;
}

function Home() {
  const { data: coins, isLoading: isLoadingFetchCoins } = useQuery(["fetchCoins"], fetchCoins);



  return (
    <>
      <Helmet>
        <title>Coin List</title>
      </Helmet>
      <Header>
        <HeaderToolbarContainer>
          <Title>Coin List</Title>
         
        </HeaderToolbarContainer>
      </Header>
      <Main>
        {isLoadingFetchCoins ? (
          <Loader>
            Loading...
          </Loader>
        ) : (
          <CoinList>
            {coins?.slice(0, 100).map((coin) => (
              <Coin key={coin.id}>
                <Link to={`/${coin.id}`} state={{ name: coin.name }}>
                  <CoinIcon src={getCoinIconUrl(coin.symbol)} alt={coin.symbol}/>
                  <CoinContent>{coin.name}</CoinContent>
                  <CoinContent>&rarr;</CoinContent>
                </Link>
              </Coin>
            ))}
          </CoinList>
        )}
      </Main>
    </>
  );
}

export default Home;
