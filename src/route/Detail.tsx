import { Header, HeaderToolbarContainer, Title } from "../styled/Header";
import { Link, Outlet, useLocation, useMatch, useOutletContext, useParams } from "react-router-dom";
import { Main } from "../styled/Main";
import { useQuery } from "react-query";
import { fetchCoinDetail } from "../query/coin-api";
import { Helmet } from "react-helmet-async";
import { Loader } from "../styled/Loader";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { lighten } from "polished";

interface DetailLocation {
  state?: {
    name: string;
  }
}

const BackButton = styled.button`
  padding: 0;
  border: 0;
  font-size: 20px;
  color: ${(props) => props.theme.textColor};
  background-color: transparent;
  
  .back-button-icon {
    padding: 4px 8px;
  }
`;

const CoinDescription = styled.p`
  font-size: 14px;
  font-style: italic;
`;

const CoinCard = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
  padding: 10px 20px;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => lighten(0.1, props.theme.bgColor)};
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

const CoinCardTag = styled.div`
  display: inline-block;
  font-size: 14px;
  word-break: break-all;
  
  & > span {
    display: inline-block;
    padding: 2px;
    border: 1.5px outset;
    word-break: break-all;
  }
`;

const CoinCardItem = styled.div<{ size?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: ${(props) => (props.size === "full") ? "100%" : "33%"};
  font-size: 18px;

  & > span:first-child {
    color: ${(props) => props.theme.accentColor};
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
  }
`;

const CoinDetail = styled.div``;

const CoinTab = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  background-color: ${(props) => lighten(0.1, props.theme.bgColor)};
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

const CoinTabToggleButton = styled.button<{ active?: boolean }>`
  flex: 1;
  border: 1px solid ${(props) => props.active ? props.theme.accentColor : "transparent"};
  border-radius: 16px;
  color: ${(props) => props.active ? props.theme.accentColor : props.theme.textColor};
  background-color: transparent;
  font-size: 18px;
  
  a {
    display: block;
  }
`;

const CoinTabDisplay = styled.div`
  margin-top: 16px;
`;

function Detail() {
  const { coinId } = useParams();
  const { state: locationState } = useLocation() as DetailLocation;
  const chartRouteMatch = useMatch("/:coinId/chart");
  const priceRouteMatch = useMatch("/:coinId/price");

  const { data: coinDetail, isLoading: isLoadingFetchCoinDetail } = useQuery(
    ["fetchCoinDetail", coinId],
    () => fetchCoinDetail(coinId ?? ""),
    {
      enabled: Boolean(coinId),
    });

  const marketCap = coinDetail?.ticker?.quotes?.USD?.market_cap?.toLocaleString();

  return (
    <>
      <Helmet>
        <title>
          {locationState?.name ?? (coinDetail?.name ?? "Coin Tracker")}
          {marketCap ? ` ($${marketCap})` : ""}
        </title>
      </Helmet>
      <Header>
        <HeaderToolbarContainer>
          <BackButton>
            <Link to="/">
              <FontAwesomeIcon className="back-button-icon" icon={faArrowLeft}/>
            </Link>
          </BackButton>
          <Title>{locationState?.name ?? (coinDetail?.name ?? "Loading...")}</Title>
        </HeaderToolbarContainer>
      </Header>
      <Main>
        {isLoadingFetchCoinDetail ? (
          <Loader>
            Loading...
          </Loader>
        ) : (
          <CoinDetail>
            <CoinDescription>
              {coinDetail?.description || "No Description"}
            </CoinDescription>
            <CoinCard>
              <CoinCardItem>
                <span>SYMBOL</span>
                <span>{coinDetail?.symbol || "Unknown"}</span>
              </CoinCardItem>
              <CoinCardItem>
                <span>RANK</span>
                <span>{coinDetail?.rank || "Unknown"}</span>
              </CoinCardItem>
              <CoinCardItem>
                <span>MARKET CAP</span>
                <span>{marketCap ? `$${marketCap}` : "Unknown"}</span>
              </CoinCardItem>
            </CoinCard>
            <CoinCard>
              <CoinCardItem>
                <span>TOTAL SUPPLY</span>
                <span>{coinDetail?.ticker?.total_supply
                  ? coinDetail.ticker.total_supply.toLocaleString() : "Unknown"}</span>
              </CoinCardItem>
              <CoinCardItem>
                <span>MAX SUPPLY</span>
                <span>{coinDetail?.ticker?.max_supply
                  ? coinDetail.ticker.max_supply.toLocaleString() : "Unknown"}</span>
              </CoinCardItem>
            </CoinCard>
            <CoinCard>
              <CoinCardItem size="full">
                <span>TAGS</span>
                <CoinCardTag>
                  {coinDetail?.tags?.map((tag, index) => (
                    <span key={tag.id}>
                      {tag.name}
                    </span>
                  )) ?? "Unknown"}
                </CoinCardTag>
              </CoinCardItem>
            </CoinCard>
            <CoinTab>
              <CoinTabToggleButton active={Boolean(chartRouteMatch)}>
                <Link to="chart">
                  CHART
                </Link>
              </CoinTabToggleButton>
              {" "}
              <CoinTabToggleButton active={Boolean(priceRouteMatch)}>
                <Link to="price">
                  PRICE
                </Link>
              </CoinTabToggleButton>
            </CoinTab>
            <CoinTabDisplay>
              <Outlet context={{ symbol: coinDetail?.symbol}}/>
            </CoinTabDisplay>
          </CoinDetail>
        )}
      </Main>
    </>
  );
}

export function useCoinDetailOutletContext() {
  return useOutletContext<{ symbol: string }>();
}

export default Detail;
