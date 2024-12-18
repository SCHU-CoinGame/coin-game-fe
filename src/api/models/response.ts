export interface UpbitData {
  change: string;
  change_price: number;
  change_rate: number;
  code: string;
  coin_name: string;
  high_price: number;
  low_price: number;
  timestamp: number;
  trade_price: number;
  trade_timestamp: number;
}

export interface Deeplearning {
  largest_rise: boolean;
  code: string;
  largest_spike: boolean;
  fastest_growth: boolean;
  most_volatile: boolean;
  percentage: number;
  largest_drop: boolean;
  fastest_decline: boolean;
  least_volatile: boolean;
  rank: number;
}

export interface GetUserDataResponse {
  message: string;
  data: UserData[];
}

export interface UserData {
  affiliation: string;
  balance: number;
  nickname: string;
  coin_3: string;
  coin_2: string;
  coin_1: string;
  name: string;
}

export interface GetAffiliationListResponse {
  message: string;
  affiliation: string[];
}
