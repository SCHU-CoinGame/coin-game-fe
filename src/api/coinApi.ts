const coinURL = import.meta.env.VITE_COIN_API;

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from 'axios';

class Api {
  private client: AxiosInstance;

  constructor(config?: CreateAxiosDefaults) {
    this.client = axios.create(config);
  }

  public get<T>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get(path, config);
  }

  public post<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post(path, data, config);
  }

  public put<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put(path, data, config);
  }

  public delete<T>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete(path, config);
  }
}

const coinApi = new Api({
  baseURL: coinURL,
  headers: {
    'content-type': 'application/json',
  },
  timeout: 60000,
});

export { coinApi };
