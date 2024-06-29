import { useCallback, useState } from 'react';
import { HttpMethod } from '../enums/HttpMethods';

type RequestOptions = {
  path: string;
  payload?: string;
  contentType?: string;
  customHeaders?: Record<string, string>;
};

export type ResponseParams = {
  statusCode: number;
  message?: string;
};

type ApiService = {
  isFetching: boolean;
  fetch: <T>(
    method: HttpMethod,
    params: RequestOptions
  ) => Promise<[body: T, resParams: ResponseParams]>;
};

const request = async <T>(
  method: HttpMethod,
  params: RequestOptions,
  customHeaders?: Record<string, string>
): Promise<[body: T, resParams: ResponseParams]> => {
  let body = null;
  const { path, payload, contentType } = params;

  const headers = {
    'Content-Type': contentType ? contentType : 'application/json',
    ...customHeaders,
  };

  const response = await fetch(path, {
    method,
    body: payload,
    headers,
  });

  try {
    body = await response.json();
  } catch {
    console.error('Error while parsing the response :(');
  }

  return [body, { statusCode: response.status, message: response.statusText }];
};

export const useApi = (): ApiService => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const fetch = useCallback(
    async <T>(method: HttpMethod, params: RequestOptions) => {
      const { customHeaders } = params;
      setIsFetching(true);
      const response = await request<T>(method, params, customHeaders).finally(
        () => setIsFetching(false)
      );
      return response;
    },
    []
  );

  return {
    isFetching,
    fetch,
  };
};
