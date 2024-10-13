import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserInfoState {
  userInfo: {
    name: string;
    department: string;
    student_id: string;
    nickname: string;
  };
  changeUserInfo: (value: {
    name: string;
    department: string;
    student_id: string;
    nickname: string;
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
      },
      changeUserInfo: (value: {
        name: string;
        department: string;
        student_id: string;
        nickname: string;
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
export { useUserInfoStore, useCoinInfoStore };
