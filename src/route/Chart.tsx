import { useCoinDetailOutletContext } from "./Detail";
import { useQuery } from "react-query";
import { fetchCoinCandles } from "../query/coin-api";
import { Loader } from "../styled/Loader";
import ReactApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atom";

function Chart() {
  const { symbol } = useCoinDetailOutletContext();
  const { data: coinCandles, isLoading: isLoadingCoinCandles } = useQuery(["fetchCoinCandles", symbol], () => fetchCoinCandles(symbol));
  const isDark = useRecoilValue(isDarkAtom);
  return (
    <>
      {isLoadingCoinCandles ? (
        <Loader>
          Loading...
        </Loader>
      ) : (
        coinCandles ? (
          <ReactApexChart
            type="candlestick"
            series={[
              {
                name: "Price",
                data: coinCandles.slice(0).reverse().map(coinCandle => (
                  {
                    x: coinCandle.candle_date_time_kst,
                    y: [coinCandle.opening_price, coinCandle.high_price, coinCandle.low_price, coinCandle.trade_price],
                  }
                )),
              }
            ]}
            options={{
              theme: {
                mode: "dark",
              },
              plotOptions: {
                candlestick: {
                  colors: {
                    upward: "#c0392b",
                    downward: "#2980b9",
                  },
                },
              },
              xaxis: {
                type: "datetime",
                labels: {
                  show: false,
                },
                axisBorder: {
                  show: false,
                },
                axisTicks: {
                  show: false,
                },
              },
              yaxis: {
                tickAmount: 8,
                labels: {
                  formatter: (val) => {
                    const fixedLength = Math.max(0, 5 - Math.abs(Math.trunc(val)).toString().length);

                    if (fixedLength === 0) {
                      return Math.trunc(val).toLocaleString();
                    } else {
                      return val.toFixed(fixedLength);
                    }
                  },
                },
                tooltip: {
                  enabled: true
                },
              },
              tooltip: {
                x: {
                  formatter: (val) => (new Date(val)).toLocaleDateString(),
                },
              }
            }}
          />
        ) : "Not Available"
      )}
    </>
  );
}

export default Chart;
