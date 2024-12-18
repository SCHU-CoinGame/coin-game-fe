import { coinApi } from 'api/coinApi';
import {
  COIN_API,
  DEEPLEARNING_API,
  SET_USER_DATA_API,
  GET_USER_DATA_API,
  GET_AFFILIATION_LIST_API,
} from 'api/constant';
import {
  UpbitData,
  Deeplearning,
  GetUserDataResponse,
  GetAffiliationListResponse,
} from 'api/models/response';
import { SetUserDataRequest, GetUserDataRequest } from 'api/models/request';

async function getUpbitData() {
  try {
    const res = await coinApi.get<UpbitData[]>(COIN_API);
    if (res.status !== 200) throw new Error(`Unexpected status code: ${res.status}`);
    return res.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '문제 발생');
  }
}

async function getDeeplearningData() {
  try {
    const res = await coinApi.get<Deeplearning[]>(DEEPLEARNING_API);
    if (res.status !== 200) throw new Error(`Unexpected status code: ${res.status}`);
    return res.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '문제 발생');
  }
}

async function setUserData(data: SetUserDataRequest) {
  try {
    const res = await coinApi.post(SET_USER_DATA_API, data);
    if (res.status !== 200) throw new Error(`Unexpected status code: ${res.status}`);
    return res.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '문제 발생');
  }
}

async function getUserData(data: GetUserDataRequest) {
  try {
    const res = await coinApi.get<GetUserDataResponse>(GET_USER_DATA_API, { params: data });
    if (res.status !== 200) throw new Error(`Unexpected status code: ${res.status}`);
    return res.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '문제 발생');
  }
}

async function getAffiliationData() {
  try {
    const res = await coinApi.get<GetAffiliationListResponse>(GET_AFFILIATION_LIST_API);
    if (res.status !== 200) throw new Error(`Unexpected status code: ${res.status}`);
    return res.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '문제 발생');
  }
}

export { getUpbitData, getDeeplearningData, setUserData, getUserData, getAffiliationData };
