import nodeFetch from 'node-fetch';
import { pick } from 'ramda';
import { GetServerSidePropsContext } from 'next';
import { stringify } from 'querystring';

export type RequestOptions = {
  method?: string;
  ctx: GetServerSidePropsContext;
  body?: Record<string, any>;
  query?: Record<string, any>;
};

export const request = async (url: string, options: RequestOptions) => {
  const { method = 'GET', ctx, body, query } = options;
  const baseUrl = process.env.BASE_URL;
  const headers = pick(['x-real-ip', 'cookie'], ctx.req.headers || { 'x-real-ip': '127.0.0.1' });
  return nodeFetch(`${baseUrl}${url}${query ? `?${stringify(query)}` : ''}`, {
    method,
    headers: {
      ...headers,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

export type ApiResponse<T = any> = {
  status?: 'ok';
  data?: T;
};

export const clientRequest = async <T = any>(
  url: string,
  options: Omit<RequestOptions, 'ctx'> = {},
): Promise<ApiResponse<T>> => {
  const baseUrl = BASE_URL;
  const { method = 'GET', body, query } = options;
  const res = await fetch(`${baseUrl}${url}${query ? `?${stringify(query)}` : ''}`, {
    method,
    headers: {
      'content-type': 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify(body),
  });
  return res.json();
};

export const swrRequest = (options: Omit<RequestOptions, 'ctx'> = {}) => {
  return async (url: string) => clientRequest(url, options);
};
