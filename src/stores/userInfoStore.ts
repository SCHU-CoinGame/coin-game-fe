import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserInfoState {
  userInfo: {
    name: string;
    department: string;
    student_id: string;
    nickname: string;
    reTryCount: number;
    highScore: number;
  };
  changeUserInfo: (value: {
    name: string;
    department: string;
    student_id: string;
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
        department: '',
        student_id: '',
        nickname: '',
        reTryCount: 2,
        highScore: 0,
      },
      changeUserInfo: (value: {
        name: string;
        department: string;
        student_id: string;
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

export { useUserInfoStore, useCoinInfoStore, useCoinListStore, useDeeplearningRankStore };
