import { coinApi } from 'api/coinApi';
import { SET_CLICK_STREAM_API } from 'api/constant';
import { UserClickStreamState } from 'api/models/request';

async function setClickStream(data: UserClickStreamState) {
  try {
    const res = await coinApi.post<UserClickStreamState>(SET_CLICK_STREAM_API, data);
    if (res.status !== 200) throw new Error(`Unexpected status code: ${res.status}`);
    return res.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '문제 발생');
  }
}

export { setClickStream };
