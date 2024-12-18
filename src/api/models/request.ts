export interface SetUserDataRequest {
  name: string;
  affiliation: string;
  nickname: string;
  coin_1: string;
  coin_2: string;
  coin_3: string;
  balance: number;
}

export interface GetUserDataRequest {
  affiliation: string;
}

export interface GetAffiliationListResponse {
  affiliation: string[];
}

interface DeepLearningData {
  code: string;
  fastest_decline: boolean;
  fastest_growth: boolean;
  largest_drop: boolean;
  largest_rise: boolean;
  largest_spike: boolean;
  least_volatile: boolean;
  most_volatile: boolean;
  percentage: number;
  rank: number;
}

export interface UserClickStreamState {
  userName: string;
  userAffiliation: string;
  userNickname: string;
  remainingTime_1: number;
  remainingTime_2: number;
  remainingTime_3: number;
  coins: string[];
  deeplearningData: DeepLearningData[];
  aiRecommend_1: boolean;
  aiRecommend_2: boolean;
  leverage: number;
  userBuyCoinMoney_1: { coin: string; money: number };
  userBuyCoinMoney_2: { coin: string; money: number };
  userBuyCoinMoney_3: { coin: string; money: number };
  userSellTime_1: { coin: string; time: number };
  userSellTime_2: { coin: string; time: number };
  userSellTime_3: { coin: string; time: number };
  balance: number;
}
