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

export interface GetUserAnalysisResponse {
  ai_recommend_1_ratio: {
    aiRecommend_1: boolean;
    count: number;
    ratio: number;
  }[];
  ai_recommend_2_ratio: {
    aiRecommend_2: boolean;
    count: number;
    ratio: number;
  }[];
  avg_balance: {
    avg_balance: number;
  };
  coin_avg_sell_time: {
    coin: string;
    avg_sell_time: number;
  }[];
  coin_ratio: {
    coin: string;
    count: number;
    ratio: number;
  }[];
  leverage_ratio: {
    leverage: number;
    count: number;
    ratio: number;
  }[];
  page_time_avg: {
    avg_time_1: number;
    avg_time_2: number;
    avg_time_3: number;
  };
  sell_time_avg: {
    avg_sell_time_1: number;
    avg_sell_time_2: number;
    avg_sell_time_3: number;
  };
  top_10_percent_coin_ratio: {
    coin: string;
    count: number;
    ratio: number;
  }[];
  top_10_percent_avg_sell_time_by_category: {
    avg_sell_time_1: number;
    avg_sell_time_2: number;
    avg_sell_time_3: number;
  };
  ai_recommend_1_avg_balance: {
    aiRecommend_1: boolean;
    avg_balance: number;
  }[];
  ai_recommend_2_avg_balance: {
    aiRecommend_2: boolean;
    avg_balance: number;
  }[];
  leverage_avg_balance: {
    leverage: number;
    avg_balance: number;
  }[];
}
