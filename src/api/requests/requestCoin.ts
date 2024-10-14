import { coinApi } from 'api/coinApi';
import { COIN_API } from 'api/constant';
import { UpbitData } from 'api/models/request';

async function getUpbitData() {
  try {
    const res = await coinApi.get<UpbitData[]>(COIN_API);
    if (res.status !== 200) throw new Error(`Unexpected status code: ${res.status}`);
    return res.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '문제 발생');
  }
}

export { getUpbitData };
