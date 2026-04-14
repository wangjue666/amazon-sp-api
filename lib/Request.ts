import qs from 'qs';
import { spEncodeURIComponent, doubleEncodeURICompenent } from './utils';
import TimeoutManager from './TimeoutManager';
import https from 'https';
import { URL } from 'url';
import http from 'http';

export interface RequestOptions {
  method?: string;
  url: string;
  body?: string | Buffer;
  headers?: Record<string, string | number>;
  timeouts?: { response?: number; idle?: number; deadline?: number };
}

export interface RequestResponse {
  body: string;
  chunks: Buffer[];
  statusCode?: number;
  headers: http.IncomingHttpHeaders;
  request: Record<string, unknown>;
}

export interface SPOptions {
  use_sandbox: boolean;
  user_agent: string;
  debug_log: boolean;
  timeouts: { response?: number; idle?: number; deadline?: number };
  retry_remote_timeout: boolean;
  https_proxy_agent?: http.Agent;
  [key: string]: unknown;
}

export interface ApiReqParams {
  method: string;
  api_path: string;
  query?: Record<string, unknown>;
  body?: unknown;
  headers?: Record<string, string>;
  encode_twice?: boolean;
  restore_rate?: number;
  operation?: string;
  timeouts?: { response?: number; idle?: number; deadline?: number };
  [key: string]: unknown;
}

export interface DownloadDetails {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  compressionAlgorithm?: string;
}

class Request {
  private _region: string;
  private _aws_regions: Record<string, string>;
  private _options: SPOptions;
  private _api_endpoint: string;

  constructor(region: string, options: SPOptions) {
    this._region = region;
    this._aws_regions = {
      eu: 'eu-west-1',
      na: 'us-east-1',
      fe: 'us-west-2'
    };
    this._options = options;
    const sandbox_prefix = this._options.use_sandbox ? 'sandbox.' : '';
    this._api_endpoint = `${sandbox_prefix}sellingpartnerapi-${this._region}.amazon.com`;
  }

  private _getUTCISODate(): string {
    return new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
  }

  private _encodeApiPath(api_path: string): string {
    return api_path
      .split('/')
      .map((url_part) => {
        return spEncodeURIComponent(url_part);
      })
      .join('/');
  }

  private _constructEncodedQueryString(query?: Record<string, unknown>, encode_twice?: boolean): string {
    if (query) {
      let key_is_array = false;
      return qs.stringify(query, {
        encoder: (value: string, defaultEncoder: qs.defaultEncoder, charset: string, type: string) => {
          if (type === 'key') {
            key_is_array = Array.isArray(query[value]);
          }
          return encode_twice ? doubleEncodeURICompenent(value, key_is_array) : spEncodeURIComponent(value);
        },
        arrayFormat: 'comma',
        commaRoundTrip: false,
        sort: (a: string, b: string) => {
          return a.localeCompare(b);
        }
      });
    }
    return '';
  }

  private _constructURL(req_params: ApiReqParams, encoded_query_string: string): string {
    // We don't have to encode api_path parts here because parts have already been encoded in version operation definitions
    let url = 'https://' + this._api_endpoint + req_params.api_path;
    if (encoded_query_string !== '') {
      url += '?' + encoded_query_string;
    }
    return url;
  }

  _constructRequestOptions(access_token: string, req_params: ApiReqParams): RequestOptions {
    const encoded_query_string = this._constructEncodedQueryString(req_params.query, req_params.encode_twice);

    return {
      method: req_params.method,
      url: this._constructURL(req_params, encoded_query_string),
      body: req_params.body ? JSON.stringify(req_params.body) : undefined,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        host: this._api_endpoint,
        'user-agent': this._options.user_agent,
        'x-amz-access-token': access_token,
        'x-amz-date': this._getUTCISODate(),
        ...(req_params.headers || {})
      },
      timeouts: req_params.timeouts
    };
  }

  private async _wait(restore_rate: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, restore_rate * 1000);
    });
  }

  private async _retryRequest(code: string, req_options: RequestOptions, req_params: ApiReqParams): Promise<RequestResponse> {
    // When an ETIMEDOUT error is fired we retry after 10 seconds or after the restore rate
    // depending on which value is higher to give the server some time to recover
    const restore_rate = req_params.restore_rate ? Math.max(...[req_params.restore_rate, 10]) : 10;
    if (this._options.debug_log) {
      console.log(
        `Request failed with error ${code}, retrying a call of ${
          req_params.operation || req_params.api_path || req_options.url
        } in ${restore_rate} seconds...`
      );
      await this._wait(restore_rate);
    }
    return await this.execute(req_options, req_params);
  }

  execute(req_options: RequestOptions, req_params: ApiReqParams = {} as ApiReqParams): Promise<RequestResponse> {
    return new Promise((resolve, reject) => {
      const url = new URL(req_options.url);
      const options: https.RequestOptions = {
        method: req_options.method,
        port: 443,
        hostname: url.hostname,
        path: url.pathname + url.search,
        headers: req_options.headers || {},
        ...(this._options.https_proxy_agent ? { agent: this._options.https_proxy_agent } : {})
      };

      let post_params: string | Buffer | undefined;
      let parsed_body: Record<string, unknown> = {};
      if (req_options.body) {
        post_params = req_options.body;
        (options.headers as Record<string, string | number>)['Content-Length'] = Buffer.byteLength(post_params);
        try {
          if (typeof req_options.body === 'string') {
            parsed_body = { body: JSON.parse(req_options.body) };
          } else {
            parsed_body = { body: req_options.body };
          }
        } catch (e) {
          parsed_body = { body: req_options.body };
        }
      }

      const req_obj = {
        ...options,
        ...parsed_body
      };

      const timeouts = new TimeoutManager(req_options.timeouts);

      const req = https.request(options, (res) => {
        const chunks: Buffer[] = [];
        let body = '';
        res.on('data', (chunk: Buffer) => {
          timeouts.onResData();
          body += chunk;
          chunks.push(chunk);
        });
        res.on('end', () => {
          timeouts.onResEnd();
          resolve({
            body: body,
            chunks: chunks,
            statusCode: res.statusCode,
            headers: res.headers,
            request: req_obj
          });
        });
      });

      if (this._options.debug_log) {
        console.dir(req_obj, { depth: null });
      }

      timeouts.init(req);

      req.on('error', async (e: NodeJS.ErrnoException) => {
        timeouts.onResEnd();
        if (['ETIMEDOUT', 'ENOTFOUND', 'ECONNRESET'].includes(e.code || '') && this._options.retry_remote_timeout)
          resolve(await this._retryRequest(e.code || '', req_options, req_params));
        reject(e);
      });
      if (post_params) {
        req.write(post_params, 'utf8');
      }
      req.end();
    });
  }

  streamDownload(req_options: RequestOptions): Promise<http.IncomingMessage> {
    return new Promise((resolve, reject) => {
      const url = new URL(req_options.url);
      const options: https.RequestOptions = {
        method: req_options.method,
        port: 443,
        hostname: url.hostname,
        path: url.pathname + url.search,
        headers: req_options.headers || {}
      };
      const req = https.request(options, (res) => {
        resolve(res);
      });

      req.on('error', (e) => {
        reject(e);
      });
      req.end();
    });
  }

  async api(access_token: string, req_params: ApiReqParams): Promise<RequestResponse> {
    const req_options = this._constructRequestOptions(access_token, req_params);
    return await this.execute(req_options, req_params);
  }
}

export default Request;
