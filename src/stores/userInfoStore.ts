import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { GetUserAnalysisResponse } from 'api/models/response';

interface UserInfoState {
  userInfo: {
    name: string;
    affiliation: string;
    nickname: string;
    reTryCount: number;
    highScore: number;
  };
  changeUserInfo: (value: {
    name: string;
    affiliation: string;
    nickname: string;
    reTryCount: number;
    highScore: number;
  }) => void;
}

const useUserInfoStore = create(
  persist<UserInfoState>(
    (set) => ({
      userInfo: {
        name: '',
        affiliation: '',
        nickname: '',
        reTryCount: 2,
        highScore: 0,
      },
      changeUserInfo: (value: {
        name: string;
        affiliation: string;
        nickname: string;
        reTryCount: number;
        highScore: number;
      }) => set({ userInfo: value }),
    }),
    {
      name: 'userInfo',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

interface CoinInfoState {
  coinInfo: {
    coin_1: { value: string; label: string };
    coin_2: { value: string; label: string };
    coin_3: { value: string; label: string };
  };
  balance: number;
  changeCoinInfo: (value: {
    coin_1: { value: string; label: string };
    coin_2: { value: string; label: string };
    coin_3: { value: string; label: string };
  }) => void;
  changeBalance: (value: number) => void;
}

const useCoinInfoStore = create(
  persist<CoinInfoState>(
    (set) => ({
      coinInfo: {
        coin_1: { value: '', label: '' },
        coin_2: { value: '', label: '' },
        coin_3: { value: '', label: '' },
      },
      balance: 0,
      changeCoinInfo: (value: {
        coin_1: { value: string; label: string };
        coin_2: { value: string; label: string };
        coin_3: { value: string; label: string };
      }) => set({ coinInfo: value }),
      changeBalance: (value: number) => set({ balance: value }),
    }),
    {
      name: 'coinInfo',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

interface CoinListState {
  coinList: { value: string; label: string }[]; // 배열 타입으로 변경
  changeCoinList: (
    value: { value: string; label: string }[], // 배열 타입으로 변경
  ) => void;
}

const useCoinListStore = create(
  persist<CoinListState>(
    (set) => ({
      coinList: [
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' },
      ],
      changeCoinList: (
        value: { value: string; label: string }[], // 배열 타입으로 변경
      ) => set({ coinList: value }),
    }),
    {
      name: 'coinList',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

interface DeeplearningRankState {
  deeplearningRank: number[];
  changeDeeplearningRank: (value: number[]) => void;
}

const useDeeplearningRankStore = create(
  persist<DeeplearningRankState>(
    (set) => ({
      deeplearningRank: [],
      changeDeeplearningRank: (value: number[]) => set({ deeplearningRank: value }),
    }),
    {
      name: 'deeplearningRank',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
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

interface UserClickStreamState {
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

  updateRemainingTime: (stage: 1 | 2 | 3, time: number) => void;
  updateCoins: (coins: string[]) => void;
  updateDeeplearningData: (data: DeepLearningData[]) => void;
  updateAiRecommend: (stage: 1 | 2, value: boolean) => void;
  updateLeverage: (leverage: number) => void;
  updateUserBuyCoinMoney: (stage: 1 | 2 | 3, data: { coin: string; money: number }) => void;
  updateUserSellTime: (stage: 1 | 2 | 3, data: { coin: string; time: number }) => void;
  updateBalance: (balance: number) => void;

  resetState: () => void;
}

const useUserClickStreamStore = create(
  persist<UserClickStreamState>(
    (set) => ({
      // 초기 상태
      remainingTime_1: 0,
      remainingTime_2: 0,
      remainingTime_3: 0,
      coins: [],
      deeplearningData: [],
      aiRecommend_1: false,
      aiRecommend_2: false,
      leverage: 0,
      userBuyCoinMoney_1: { coin: '', money: 0 },
      userBuyCoinMoney_2: { coin: '', money: 0 },
      userBuyCoinMoney_3: { coin: '', money: 0 },
      userSellTime_1: { coin: '', time: 0 },
      userSellTime_2: { coin: '', time: 0 },
      userSellTime_3: { coin: '', time: 0 },
      balance: 0,

      // 업데이트 함수들
      updateRemainingTime: (stage: 1 | 2 | 3, time: number) =>
        set((state) => ({
          [`remainingTime_${stage}`]: time,
        })),

      updateCoins: (coins: string[]) =>
        set(() => ({
          coins,
        })),

      updateDeeplearningData: (data: DeepLearningData[]) =>
        set(() => ({
          deeplearningData: data,
        })),

      updateAiRecommend: (stage: 1 | 2, value: boolean) =>
        set((state) => ({
          [`aiRecommend_${stage}`]: value,
        })),

      updateLeverage: (leverage: number) =>
        set(() => ({
          leverage,
        })),

      updateUserBuyCoinMoney: (stage: 1 | 2 | 3, data: { coin: string; money: number }) =>
        set((state) => ({
          [`userBuyCoinMoney_${stage}`]: data,
        })),

      updateUserSellTime: (stage: 1 | 2 | 3, data: { coin: string; time: number }) =>
        set((state) => ({
          [`userSellTime_${stage}`]: data,
        })),

      updateBalance: (balance: number) =>
        set(() => ({
          balance,
        })),
      resetState: () =>
        set({
          remainingTime_1: 0,
          remainingTime_2: 0,
          remainingTime_3: 0,
          coins: [],
          deeplearningData: [],
          aiRecommend_1: false,
          aiRecommend_2: false,
          leverage: 0,
          userBuyCoinMoney_1: { coin: '', money: 0 },
          userBuyCoinMoney_2: { coin: '', money: 0 },
          userBuyCoinMoney_3: { coin: '', money: 0 },
          userSellTime_1: { coin: '', time: 0 },
          userSellTime_2: { coin: '', time: 0 },
          userSellTime_3: { coin: '', time: 0 },
          balance: 0,
        }),
    }),
    {
      name: 'userClickStream',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

interface UserAnalysisStore {
  userAnalysis: GetUserAnalysisResponse | null;
  setUserAnalysis: (data: GetUserAnalysisResponse) => void;
}
const useUserAnalysisStore = create(
  persist<UserAnalysisStore>(
    (set) => ({
      userAnalysis: null,
      setUserAnalysis: (data) => set({ userAnalysis: data }),
    }),
    {
      name: 'userAnalysis',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export {
  useUserInfoStore,
  useCoinInfoStore,
  useCoinListStore,
  useDeeplearningRankStore,
  useUserClickStreamStore,
  useUserAnalysisStore,
};
