const COINPAPRIKA_BASE_URL = "https://api.coinpaprika.com/v1";
const UPBIT_BASE_URL = "https://api.upbit.com/v1";

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

export interface CoinDetailTicker {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  last_updated: Date;
  quotes?: {
    USD?: {
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_15m: number;
      percent_change_30m: number;
      percent_change_1h: number;
      percent_change_6h: number;
      percent_change_12h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_1y: number;
      ath_price: number;
      ath_date: Date;
      percent_from_price_ath: number;
    }
  };
}

export interface CoinDetail {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  tags: {
    id: string;
    name: string;
    coin_counter: number;
    ico_counter: number;
  }[];
  team: {
    id: string;
    name: string;
    position: string;
  }[];
  description?: string;
  message: string;
  open_source: boolean;
  hardware_wallet: boolean;
  started_at?: Date;
  development_status?: string;
  proof_type?: string;
  org_structure?: string;
  hash_algorithm?: string;
  links: {
    explorer?: string[];
    facebook?: string[];
    reddit?: string[];
    source_code?: string[];
    website?: string[];
    youtube?: string[];
    medium?: string[];
  }[];
  links_extended: {
    url: string;
    type: string;
    stats?: {
      subscribers?: number;
      contributors?: number;
      stars?: number;
      followers?: number;
    };
  }[];
  whitepaper: {
    link?: string;
    thumbnail?: string;
  };
  first_data_at: Date;
  last_data_at: Date;
  ticker?: CoinDetailTicker;
}

export interface CoinTicker {
  market: string;
  trade_date: string;
  trade_time: string;
  trade_date_kst: string;
  trade_time_kst: string;
  trade_timestamp: number;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  prev_closing_price: number;
  change: string;
  change_price: number;
  change_rate: number;
  signed_change_price: number;
  signed_change_rate: number;
  trade_volume: number;
  acc_trade_price: number;
  acc_trade_price_24h: number;
  acc_trade_volume: number;
  acc_trade_volume_24h: number;
  highest_52_week_price: number;
  highest_52_week_date: string;
  lowest_52_week_price: number;
  lowest_52_week_date: string;
  timestamp: number;
}

export interface CoinCandle {
  market: string;
  candle_date_time_utc: Date;
  candle_date_time_kst: Date;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  timestamp: any;
  candle_acc_trade_price: number;
  candle_acc_trade_volume: number;
  unit: number;
}

export async function fetchCoins() {
  const coins: Coin[] = await fetch(`${COINPAPRIKA_BASE_URL}/coins`, { cache: "no-store" }).then(response => response.json());
  return coins;
}

export async function fetchCoinDetail(coinPaprikaId: string) {
  const coinDetail: CoinDetail = await fetch(`${COINPAPRIKA_BASE_URL}/coins/${coinPaprikaId}`, { cache: "no-store" }).then(response => response.json());
  coinDetail.ticker = await fetch(`${COINPAPRIKA_BASE_URL}/tickers/${coinPaprikaId}`, { cache: "no-store" }).then(response => response.json());

  return coinDetail;
}

export async function fetchCoinTicker(coinSymbol: string) {
  const coinTickers: CoinTicker[] = await fetch(`${UPBIT_BASE_URL}/ticker?markets=KRW-${coinSymbol.toUpperCase()}`, { cache: "no-store" }).then(response => response.json());

  return (Array.isArray(coinTickers) && coinTickers.length > 0) ? coinTickers[0] : undefined;
}

export async function fetchCoinCandles(coinSymbol: string) {
  const coinCandles: CoinCandle[] = await fetch(`${UPBIT_BASE_URL}/candles/days?count=200&market=KRW-${coinSymbol.toUpperCase()}`, { cache: "no-store" }).then(response => response.json());

  return (Array.isArray(coinCandles) && coinCandles.length > 0) ? coinCandles : undefined;
}
