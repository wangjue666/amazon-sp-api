import CustomError from './CustomError';
import Request, { RequestOptions, RequestResponse, SPOptions as RequestSPOptions } from './Request';
import { XMLParser } from 'fast-xml-parser';
import Credentials, { LoadedCredentials, ConfigCredentials } from './Credentials';
import endpoints, { EndpointVersionOperations } from './endpoints';
import { warn, ReqParams, DownloadOptions } from './utils';
import csv from 'csvtojson';
import fs from 'fs';
import zlib from 'zlib';
import iconv from 'iconv-lite';
import http from 'http';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const client_version: string = require('../../package.json').version;
const node_version: string = process.version;
import os from 'os';

export interface Config {
  region: 'eu' | 'na' | 'fe';
  refresh_token?: string;
  access_token?: string;
  endpoints_versions?: Record<string, string>;
  credentials?: ConfigCredentials;
  options?: Partial<SPOptions>;
}

export interface SPOptions {
  credentials_path?: string;
  auto_request_tokens: boolean;
  auto_request_throttled: boolean;
  use_sandbox: boolean;
  only_grantless_operations: boolean;
  version_fallback: boolean;
  user_agent: string;
  debug_log: boolean;
  timeouts: { response?: number; idle?: number; deadline?: number };
  retry_remote_timeout: boolean;
  https_proxy_agent?: http.Agent;
  return_as_payload: boolean;
}

export interface DownloadDocument {
  url: string;
  compressionAlgorithm?: string;
  reportDocumentId?: string;
}

export interface DownloadStreamOptions {
  unzip?: boolean;
}

export interface FeedInput {
  content?: string;
  file?: string;
  contentType: string;
}

export interface ReportReqParams {
  body: Record<string, unknown>;
  version?: string;
  tries?: number;
  interval?: number;
  cancel_after?: number;
  download?: DownloadOptions;
  [key: string]: unknown;
}

export interface CallAPIParams {
  operation?: string;
  endpoint?: string;
  path?: Record<string, string>;
  query?: Record<string, unknown>;
  body?: unknown;
  api_path?: string;
  method?: string;
  restricted_data_token?: string;
  headers?: Record<string, string>;
  options?: {
    version?: string;
    restore_rate?: number;
    raw_result?: boolean;
    timeouts?: { response?: number; idle?: number; deadline?: number };
  };
  [key: string]: unknown;
}

// Provide credentials as environment variables OR create a path and file ~/.amzspapi/credentials (located in your user folder)
// If you don't provide an access_token, the first call to an API endpoint will request them with a TTL of 1 hour
// Tokens are reused for the class instance
// Retrieve the tokens via getters if you want to use them across multiple instances of the SellingPartner class

class SellingPartner {
  private _region: string;
  private _refresh_token?: string;
  private _access_token?: string;
  private _grantless_tokens: Record<string, string>;
  private _options: SPOptions;
  private _current_call_timeouts: { response?: number; idle?: number; deadline?: number };
  private _endpoints_versions: Record<string, string>;
  private _credentials: LoadedCredentials;
  private _xml_parser: XMLParser;
  private _request: Request;

  constructor(config: Config) {
    this._region = config.region;
    this._refresh_token = config.refresh_token;
    this._access_token = config.access_token;
    // Will hold access tokens for grantless operations (with scope as key)
    this._grantless_tokens = {};
    this._options = Object.assign(
      {
        auto_request_tokens: true,
        auto_request_throttled: true,
        use_sandbox: false,
        only_grantless_operations: false,
        version_fallback: true,
        user_agent: `amazon-sp-api/${client_version} (Language=Node.js/${node_version}; Platform=${os.type()}/${os.release()})`,
        debug_log: false,
        timeouts: {},
        retry_remote_timeout: true,
        return_as_payload: false
      },
      config.options
    );
    this._current_call_timeouts = this._options.timeouts;
    this._endpoints_versions = this._validateEndpointsVersions(Object.assign({}, config.endpoints_versions));
    this._credentials = new Credentials(
      config.credentials,
      this._options.credentials_path,
      this._options.debug_log
    ).load();
    this._xml_parser = new XMLParser();

    if (!this._region || !/^(eu|na|fe)$/.test(this._region)) {
      throw new CustomError({
        code: 'NO_VALID_REGION_PROVIDED',
        message: 'Please provide one of: "eu", "na" or "fe"'
      });
    }
    if (!this._refresh_token && !this._options.only_grantless_operations) {
      throw new CustomError({
        code: 'NO_REFRESH_TOKEN_PROVIDED',
        message: 'Please provide a refresh token or set "only_grantless_operations" option to true'
      });
    }

    this._request = new Request(this._region, this._options as unknown as RequestSPOptions);
  }

  get access_token(): string | undefined {
    return this._access_token;
  }

  get endpoints(): typeof endpoints {
    return endpoints;
  }

  // Make sure that all defined endpoints and its defined versions exist
  private _validateEndpointsVersions(endpoints_versions: Record<string, string>): Record<string, string> {
    const invalid_endpoints = Object.keys(endpoints_versions).filter((endpoint) => {
      return !endpoints[endpoint];
    });
    if (invalid_endpoints.length) {
      throw new CustomError({
        code: 'VERSION_DEFINED_FOR_INVALID_ENDPOINTS',
        message: `One or more endpoints are not valid. These endpoints don't exist: ${invalid_endpoints.join(',')}`
      });
    }
    const invalid_endpoints_versions = Object.keys(endpoints_versions).filter((endpoint) => {
      return !(endpoints[endpoint].__versions as string[]).includes(endpoints_versions[endpoint]);
    });
    if (invalid_endpoints_versions.length) {
      throw new CustomError({
        code: 'INVALID_VERSION_FOR_ENDPOINTS',
        message: `The provided version for the following endpoint(s) is not valid: ${invalid_endpoints_versions.join(
          ','
        )}`
      });
    }
    return endpoints_versions;
  }

  private async _wait(restore_rate: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, restore_rate * 1000);
    });
  }

  private async _unzip(buffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      zlib.gunzip(buffer, (err, unzipped_buffer) => {
        if (err) {
          reject(err);
        }
        resolve(unzipped_buffer);
      });
    });
  }

  private async _saveFile(content: string | Buffer, options: DownloadOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      let data: string | Buffer = content;
      if (options.json) {
        data = JSON.stringify(content);
      }
      fs.writeFile(options.file!, data, (err) => {
        err ? reject(err) : resolve();
      });
    });
  }

  private async _readFile(file: string, content_type: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const regexp_charset = /charset=([^;]*)/;
      const content_match = content_type.match(regexp_charset);
      let encoding: BufferEncoding = (content_match && content_match[1] ? content_match[1] : 'utf-8') as BufferEncoding;
      // fs.readFile doesn't accept ISO-8859-1 as encoding value --> use latin1 as value which is the same
      if (encoding.toUpperCase() === 'ISO-8859-1') {
        encoding = 'latin1';
      }
      fs.readFile(file, encoding, (err, content) => {
        err ? reject(err) : resolve(content);
      });
    });
  }

  private _validateDocumentDetails(details: DownloadDocument): void {
    if (!details || !details.url) {
      throw new CustomError({
        code: 'DOCUMENT_INFORMATION_MISSING',
        message: 'Please provide url'
      });
    }
    const compression = details.compressionAlgorithm;
    // Docs state that no other zip standards should be possible, but check if its correct anyway
    if (compression && compression !== 'GZIP') {
      throw new CustomError({
        code: 'UNKNOWN_ZIP_STANDARD',
        message: `Cannot unzip ${compression}, expecting GZIP`
      });
    }
  }

  private _validateUpOrDownloadSuccess(res: RequestResponse, request_type: string): void {
    if (res.statusCode !== 200) {
      let json_res: Record<string, unknown> | undefined;
      try {
        json_res = this._xml_parser.parse(res.body) as Record<string, unknown>;
      } catch (e) {
        throw new CustomError({
          code: `${request_type}_ERROR`,
          message: res.body
        });
      }
      if (json_res && (json_res as Record<string, Record<string, string>>).Error) {
        throw new CustomError({
          code: (json_res as Record<string, Record<string, string>>).Error.Code,
          message: (json_res as Record<string, Record<string, string>>).Error.Message
        });
      } else {
        throw new CustomError({
          code: `${request_type}_ERROR`,
          message: json_res as unknown as string
        });
      }
    }
  }

  // Decode buffer with given charset
  private _decodeBuffer(decompressed_buffer: Buffer, headers?: http.IncomingHttpHeaders, charset?: string): string {
    // Try to extract charset from header if no charset explicitly defined
    if (!charset && headers && headers['content-type']) {
      const charset_match = headers['content-type'].match(/\.*charset=([^;]*)/);
      if (charset_match && charset_match[1]) {
        charset = charset_match[1];
      }
    }
    // Use utf8 as default charset if no charset given by options or in headers
    if (!charset) {
      charset = 'utf8';
    }
    try {
      return iconv.decode(decompressed_buffer, charset);
    } catch (e) {
      throw new CustomError({
        code: 'DECODE_ERROR',
        message: (e as Error).message
      });
    }
  }

  // convert a stream into a string
  private _getStreamChunks(iStream: NodeJS.ReadableStream): Promise<Buffer[]> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      iStream.on('data', (data: Buffer) => {
        chunks.push(data);
      });
      iStream.on('end', () => {
        resolve(chunks);
      });
      iStream.on('error', (error: Error) => {
        reject(error);
      });
    });
  }

  private _constructRefreshAccessTokenBody(scope?: string): string {
    const body: Record<string, string> = {
      client_id: this._credentials.app_client.id,
      client_secret: this._credentials.app_client.secret
    };
    const valid_scopes = ['sellingpartnerapi::notifications', 'sellingpartnerapi::client_credential:rotation'];
    if (scope) {
      // Make sure that scope is valid
      if (!valid_scopes.includes(scope)) {
        throw new CustomError({
          code: 'INVALID_SCOPE_ERROR',
          message: `"Scope for requesting token for grantless operations is invalid. Please provide one of: ${valid_scopes.join(
            ','
          )}`
        });
      }
      body.grant_type = 'client_credentials';
      body.scope = scope;
    } else if (!this._options.only_grantless_operations) {
      body.grant_type = 'refresh_token';
      body.refresh_token = this._refresh_token!;
    } else {
      throw new CustomError({
        code: 'NO_SCOPE_PROVIDED',
        message: `"Grantless tokens require a scope. Please provide one of: ${valid_scopes.join(',')}`
      });
    }
    return JSON.stringify(body);
  }

  private _tokenExists(scope?: string): boolean {
    return !!(
      (this._access_token && !scope) ||
      (scope && this._grantless_tokens[scope])
    );
  }

  private async _validateAccessToken(scope?: string): Promise<void> {
    if (this._options.auto_request_tokens) {
      if (!this._tokenExists(scope)) {
        await this.refreshAccessToken(scope);
      }
    }
    if (!this._tokenExists(scope)) {
      throw new CustomError({
        code: 'NO_ACCESS_TOKEN_PRESENT',
        message:
          'Did you turn off "auto_request_tokens" and forgot to refresh the access token or the scope for a grantless token?'
      });
    }
  }

  private _validateMethod(method?: string): string {
    if (!method || !/^(GET|POST|PUT|DELETE|PATCH)$/.test(method.toUpperCase())) {
      throw new CustomError({
        code: 'NO_VALID_METHOD_PROVIDED',
        message: 'Please provide a valid HTTP Method ("GET","POST","PUT","DELETE" or "PATCH") when using "api_path"'
      });
    }
    return method.toUpperCase();
  }

  private _validateOperationAndEndpoint(
    operation?: string,
    endpoint?: string
  ): { operation: string; endpoint: string } {
    if (!operation) {
      throw new CustomError({
        code: 'NO_OPERATION_GIVEN',
        message: 'Please provide an operation to call'
      });
    }
    // Split operation in endpoint and operation if shorthand dot notation
    if (operation.includes('.')) {
      const op_split = operation.split('.');
      endpoint = op_split[0];
      operation = op_split[1];
    } else if (!endpoint) {
      throw new CustomError({
        code: 'NO_ENDPOINT_GIVEN',
        message: 'Please provide an endpoint to call'
      });
    }
    if (!endpoints[endpoint!]) {
      throw new CustomError({
        code: 'ENDPOINT_NOT_FOUND',
        message: `No endpoint found: ${endpoint}`
      });
    }
    if (!(endpoints[endpoint!].__operations as string[]).includes(operation)) {
      throw new CustomError({
        code: 'INVALID_OPERATION_FOR_ENDPOINT',
        message: `The operation ${operation} is not valid for endpoint ${endpoint}`
      });
    }
    return { operation, endpoint: endpoint! };
  }

  private _getFallbackVersion(operation: string, endpoint: string, version: string): string {
    // Make sure to only look for the operation in older versions
    // --> we don't want to break stuff by accidentally calling a newer version than expected!
    const version_index = (endpoints[endpoint].__versions as string[]).indexOf(version);
    const fallback_version = (endpoints[endpoint].__versions as string[])
      .slice(0, version_index)
      .reverse()
      .find((__version) => {
        return (endpoints[endpoint][__version] as EndpointVersionOperations)?.[operation];
      });
    // Throw error if version_fallback is disabled or no fallback version was found
    if (!this._options.version_fallback || !fallback_version) {
      throw new CustomError({
        code: 'OPERATION_NOT_FOUND_FOR_VERSION',
        message: `Operation ${operation} not found for version ${version}`
      });
    }
    return fallback_version;
  }

  // Logic if version was explicitly set in .callAPI options
  private _validateLocallySetVersion(operation: string, endpoint: string, version: string): string {
    // Throw error if the explicitly specified version in .callAPI can't be found for the endpoint
    if (!(endpoints[endpoint].__versions as string[]).includes(version)) {
      throw new CustomError({
        code: 'INVALID_VERSION',
        message: `Invalid version ${version} for endpoint ${endpoint} and operation ${operation}. Should be one of: ${(
          endpoints[endpoint].__versions as string[]
        ).join('","')}`
      });
    }
    // If operation is not supported for the version:
    // --> try to find an older version of the endpoint that supports the operation
    if (!(endpoints[endpoint][version] as EndpointVersionOperations)?.[operation]) {
      return this._getFallbackVersion(operation, endpoint, version);
    }
    return version;
  }

  // Logic if version was NOT explicitly set in .callAPI options
  private _validateGloballySetVersion(operation: string, endpoint: string): string {
    // If no version for the endpoint was set in constructor config:
    // --> find the oldest version that supports the operation
    if (!this._endpoints_versions[endpoint]) {
      // We can directly return the version as its impossible for a valid operation to have no version
      return (endpoints[endpoint].__versions as string[]).find((__version) => {
        return (endpoints[endpoint][__version] as EndpointVersionOperations)?.[operation];
      })!;
    }
    // Get the version specified for the endpoint in constructor config
    const version = this._endpoints_versions[endpoint];
    // If operation is not supported for the version:
    // --> try to find an older version of the endpoint that supports the operation
    if (!(endpoints[endpoint][version] as EndpointVersionOperations)?.[operation]) {
      return this._getFallbackVersion(operation, endpoint, version);
    }
    return version;
  }

  private _validateAndGetVersion(operation: string, endpoint: string, version?: string): string {
    return version
      ? this._validateLocallySetVersion(operation, endpoint, version)
      : this._validateGloballySetVersion(operation, endpoint);
  }

  private _validateOperationAllowance(scope?: string): void {
    if (this._options.only_grantless_operations && !scope) {
      throw new CustomError({
        code: 'INVALID_OPERATION_ERROR',
        message:
          'Operation is not grantless. Set "only_grantless_operations" to false and provide a "refresh_token" to be able to call the operation.'
      });
    }
  }

  private _constructExchangeBody(auth_code?: string): string {
    if (!auth_code) {
      throw new CustomError({
        code: 'NO_AUTH_CODE_PROVIDED',
        message:
          'Please provide an authorization code (spapi_auth_code) operation to exchange it for a "refresh_token".'
      });
    }
    const body = {
      grant_type: 'authorization_code',
      code: auth_code,
      client_id: this._credentials.app_client.id,
      client_secret: this._credentials.app_client.secret
    };
    return JSON.stringify(body);
  }

  private async _createReport(req_params: ReportReqParams): Promise<string> {
    const res = await this.callAPI({
      operation: 'reports.createReport',
      body: req_params.body,
      options: {
        ...(req_params.version ? { version: req_params.version } : {})
      }
    });
    return (res as Record<string, string>).reportId;
  }

  private async _cancelReport(req_params: ReportReqParams, report_id: string): Promise<void> {
    await this.callAPI({
      operation: 'reports.cancelReport',
      path: {
        reportId: report_id
      },
      options: {
        ...(req_params.version ? { version: req_params.version } : {})
      }
    });
  }

  private async _getReport(req_params: ReportReqParams, report_id: string): Promise<string> {
    const res = (await this.callAPI({
      operation: 'reports.getReport',
      path: {
        reportId: report_id
      },
      options: {
        ...(req_params.version ? { version: req_params.version } : {})
      }
    })) as Record<string, unknown>;
    if (res.processingStatus === 'DONE') {
      return res.reportDocumentId as string;
    } else if (['CANCELLED', 'FATAL'].includes(res.processingStatus as string)) {
      throw new CustomError({
        code: 'REPORT_PROCESSING_' + res.processingStatus,
        message: 'Something went wrong while processing the report.'
      });
    } else {
      req_params.tries = (req_params.tries || 0) + 1;
      if (this._options.debug_log) {
        console.log(
          `Current status of report ${(req_params.body as Record<string, unknown>).reportType}: ${res.processingStatus} (tries: ${req_params.tries})`
        );
      }
      const interval = req_params.interval || 10000;
      if (!req_params.cancel_after || req_params.cancel_after > req_params.tries) {
        await this._wait(interval / 1000);
        return await this._getReport(req_params, report_id);
      } else {
        await this._cancelReport(req_params, report_id);
        throw new CustomError({
          code: 'REPORT_PROCESSING_CANCELLED_MANUALLY',
          message: `Report did not finish after ${req_params.tries} tries (interval ${interval} ms).`
        });
      }
    }
  }

  private async _getReportDocument(req_params: ReportReqParams, report_document_id: string): Promise<DownloadDocument> {
    const res = await this.callAPI({
      operation: 'reports.getReportDocument',
      path: {
        reportDocumentId: report_document_id
      },
      options: {
        ...(req_params.version ? { version: req_params.version } : {})
      }
    });
    return res as unknown as DownloadDocument;
  }

  private async _retryThrottledRequest(req_params: CallAPIParams, res?: RequestResponse): Promise<unknown> {
    // Wait the restore rate before retrying the call if dynamic or static restore rate is set
    if (res?.headers?.['x-amzn-ratelimit-limit'] || (req_params as Record<string, unknown>).restore_rate) {
      // Use dynamic restore rate from result header if given --> otherwise use defined default restore_rate of the operation
      const restore_rate = res?.headers?.['x-amzn-ratelimit-limit']
        ? 1 / (Number(res.headers['x-amzn-ratelimit-limit']) * 1)
        : (req_params as Record<string, unknown>).restore_rate as number;
      if (this._options.debug_log) {
        console.log(
          `Request throttled, retrying a call of ${
            req_params.operation || req_params.api_path
          } in ${restore_rate} seconds...`
        );
      }
      await this._wait(restore_rate);
    }
    return await this.callAPI(req_params);
  }

  // Exchange an authorization code (spapi_oauth_code) for a refresh token
  async exchange(auth_code: string): Promise<Record<string, unknown>> {
    const res = await this._request.execute({
      method: 'POST',
      url: 'https://api.amazon.com/auth/o2/token',
      body: this._constructExchangeBody(auth_code),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    let json_res: Record<string, unknown>;
    try {
      json_res = JSON.parse(res.body);
    } catch (e) {
      throw new CustomError({
        code: 'EXCHANGE_AUTH_CODE_PARSE_ERROR',
        message: res.body
      });
    }
    if (json_res.error) {
      throw new CustomError({
        code: json_res.error as string,
        message: json_res.error_description as string
      });
    }
    return json_res;
  }

  // If scope is provided a token for a grantless operation is requested
  // scope should be one of: ['sellingpartnerapi::notifications', 'sellingpartnerapi::client_credential::rotation']
  async refreshAccessToken(scope?: string): Promise<void> {
    const res = await this._request.execute({
      method: 'POST',
      url: 'https://api.amazon.com/auth/o2/token',
      body: this._constructRefreshAccessTokenBody(scope),
      headers: {
        'Content-Type': 'application/json'
      },
      timeouts: this._current_call_timeouts
    });
    let json_res: Record<string, unknown>;
    try {
      json_res = JSON.parse(res.body);
    } catch (e) {
      throw new CustomError({
        code: 'REFRESH_ACCESS_TOKEN_PARSE_ERROR',
        message: res.body
      });
    }
    if (json_res.access_token) {
      if (!scope) {
        this._access_token = json_res.access_token as string;
      } else {
        this._grantless_tokens[scope] = json_res.access_token as string;
      }
    } else if (json_res.error) {
      throw new CustomError({
        code: json_res.error as string,
        message: json_res.error_description as string
      });
    } else {
      throw new CustomError({
        code: 'UNKNOWN_REFRESH_ACCESS_TOKEN_ERROR',
        message: res.body
      });
    }
  }

  async callAPI(req_params: CallAPIParams): Promise<unknown> {
    const options = Object.assign({}, req_params.options);
    let params: ReqParams = req_params as unknown as ReqParams;
    if (req_params.api_path) {
      params.method = this._validateMethod(req_params.method);
    } else {
      const { operation, endpoint } = this._validateOperationAndEndpoint(req_params.operation, req_params.endpoint);
      const version = this._validateAndGetVersion(operation, endpoint, options.version);
      const operationFn = (endpoints[endpoint][version] as EndpointVersionOperations)[operation];
      params = {
        ...operationFn(params),
        ...(req_params.headers ? { headers: req_params.headers } : {})
      };
      if (params.deprecation_date) {
        warn('DEPRECATION', params.deprecation_date);
      }
      if (!this._options.use_sandbox && params.sandbox_only) {
        warn('SANDBOX_ONLY', params.operation || '');
      }
    }
    // Use user-defined restore_rate if specified, otherwise use default for operation
    if (options.restore_rate && !isNaN(options.restore_rate)) {
      params.restore_rate = options.restore_rate;
    }
    // Overwrite global timeouts definitions by call specific timeout options
    params.timeouts = Object.assign({}, this._options.timeouts, options.timeouts);
    // Store timeouts defined for the current call to use for any other requests we may need to make e.g. refresh access token
    this._current_call_timeouts = params.timeouts!;
    // Scope will only be defined for grantless operations
    const scope = params.scope;
    this._validateOperationAllowance(scope);
    await this._validateAccessToken(scope);
    // Make sure to use the correct token for the request
    let token_for_request = this._access_token!;
    if (scope) {
      token_for_request = this._grantless_tokens[scope];
    } else if (params.restricted_data_token) {
      token_for_request = params.restricted_data_token;
    }
    const res = await this._request.api(token_for_request, params as unknown as import('./Request').ApiReqParams);
    if (options.raw_result) {
      return res;
    }
    const restore_rate = res?.headers?.['x-amzn-ratelimit-limit']
      ? 1 / (Number(res.headers['x-amzn-ratelimit-limit']) * 1)
      : (params.restore_rate as number) || null;
    if (res.statusCode === 204) {
      const result = { success: true };
      return this._options.return_as_payload ? { payload: result, restore_rate } : result;
    }
    let json_res: Record<string, unknown>;
    try {
      json_res = JSON.parse(res.body.replace(/\n/g, ''));
    } catch (e) {
      throw new CustomError({
        code: 'JSON_PARSE_ERROR',
        message: res.body
      });
    }
    if ((json_res.errors as unknown[])?.length) {
      const error = (json_res.errors as Record<string, unknown>[])[0];
      // Refresh tokens when expired and auto_request_tokens is true
      if (res.statusCode === 403) {
        if (error.code === 'Unauthorized' && this._options.auto_request_tokens) {
          if (/access token.*expired/.test(error.details as string)) {
            if (this._options.debug_log) {
              console.log('Access token expired, refreshing it now');
            }
            await this.refreshAccessToken(scope);
            return await this.callAPI(req_params);
          }
        }
        // Retry when call is throttled and auto_request_throttled is true
      } else if (res.statusCode === 429 && error.code === 'QuotaExceeded' && this._options.auto_request_throttled) {
        return await this._retryThrottledRequest(req_params, res);
      } else if (error.code === 'InternalFailure' && this._options.use_sandbox) {
        throw new CustomError({
          code: 'INVALID_SANDBOX_PARAMETERS',
          message:
            "You're in SANDBOX mode, make sure sandbox parameters are correct, as in Amazon SP API documentation: https://github.com/amzn/selling-partner-api-docs/blob/main/guides/developer-guide/SellingPartnerApiDeveloperGuide.md#how-to-make-a-sandbox-call-to-the-selling-partner-api"
        });
      }
      throw new CustomError(error as { code?: string; message?: string });
    }

    // If there is a pagination outside payload (like for getInventorySummaries), this will include it with the result
    if (json_res.pagination && json_res.payload) {
      const result = Object.assign(
        json_res.pagination as Record<string, unknown>,
        json_res.payload as Record<string, unknown>
      );
      return this._options.return_as_payload ? { payload: result, restore_rate } : result;
    }

    // Some calls do not return response in payload but directly (i.e. operation "getSmallAndLightEligibilityBySellerSKU")!
    const result = json_res.payload || json_res;
    return this._options.return_as_payload ? { payload: result, restore_rate } : result;
  }

  // Download a report or feed result as a stream
  async downloadStream(details: DownloadDocument, options: DownloadStreamOptions = {}): Promise<NodeJS.ReadableStream> {
    const opts = Object.assign(
      {
        unzip: true
      },
      options
    );
    this._validateDocumentDetails(details);
    const res = await this._request.streamDownload(details as RequestOptions);
    if ((res as http.IncomingMessage).statusCode !== 200) {
      const streamChunks = await this._getStreamChunks(res);
      (res as unknown as RequestResponse).body = this._decodeBuffer(
        Buffer.concat(streamChunks),
        (res as http.IncomingMessage).headers
      );
      this._validateUpOrDownloadSuccess(res as unknown as RequestResponse, 'DOWNLOAD');
    }
    return details.compressionAlgorithm && opts.unzip
      ? (res as http.IncomingMessage).pipe(zlib.createGunzip())
      : res;
  }

  // Download a report or feed result
  async download(details: DownloadDocument, options: DownloadOptions = {}): Promise<unknown> {
    const opts = Object.assign(
      {
        unzip: true
      },
      options
    );
    this._validateDocumentDetails(details);
    // Result will be a tab-delimited flat file or an xml document
    const res = await this._request.execute({
      url: details.url,
      timeouts: opts.timeouts
    });
    this._validateUpOrDownloadSuccess(res, 'DOWNLOAD');

    // Decompress if content is compressed and unzip option is true
    let decoded: Buffer | string =
      details.compressionAlgorithm && opts.unzip
        ? await this._unzip(Buffer.concat(res.chunks))
        : Buffer.concat(res.chunks);

    if (!details.compressionAlgorithm || opts.unzip) {
      decoded = this._decodeBuffer(decoded as Buffer, res.headers, opts.charset);
      if (opts.json) {
        if (res.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          throw new CustomError({
            code: 'PARSE_ERROR',
            message: "Report is a .xlsx file. Could not parse result to JSON. Remove the 'json:true' option."
          });
        }

        // Transform content to json --> take content type from which to transform to json from result header
        try {
          if (res.headers['content-type']?.includes('xml')) {
            decoded = this._xml_parser.parse(decoded as string);
          } else if (res.headers['content-type']?.includes('plain')) {
            // Some reports are returned in JSON format with content-type text/plain (i.e. "GET_V2_SELLER_PERFORMANCE_REPORT")
            try {
              const json_res = JSON.parse(decoded as string);
              decoded = json_res;
            } catch {
              decoded = (await csv({
                delimiter: '\t',
                quote: 'off'
              }).fromString(decoded as string)) as unknown as string;
            }
          }
        } catch (e) {
          throw new CustomError({
            code: 'PARSE_ERROR',
            message: 'Could not parse result to JSON.',
            details: decoded as string
          });
        }
      }
    }
    if (opts.file) {
      await this._saveFile(decoded as string | Buffer, opts);
    }
    return decoded;
  }

  // Upload a tab-delimited flat file or an xml document
  async upload(details: DownloadDocument, feed: FeedInput): Promise<{ success: boolean }> {
    this._validateDocumentDetails(details);
    if (!feed || (!feed.content && !feed.file)) {
      throw new CustomError({
        code: 'NO_FEED_CONTENT_PROVIDED',
        message: 'Please provide "content" (string) or "file" (absolute path) of feed.'
      });
    }
    if (!feed.contentType) {
      throw new CustomError({
        code: 'NO_FEED_CONTENT_TYPE_PROVIDED',
        message:
          'Please provide "contentType" of feed (should be identical to the contentType used in "createFeedDocument" operation).'
      });
    }
    const feed_content = feed.content || (await this._readFile(feed.file!, feed.contentType));
    // Upload content
    const res = await this._request.execute({
      url: details.url,
      method: 'PUT',
      headers: {
        'Content-Type': feed.contentType
      },
      body: Buffer.from(feed_content)
    });
    this._validateUpOrDownloadSuccess(res, 'UPLOAD');
    return { success: true };
  }

  async downloadReport(req_params: ReportReqParams): Promise<unknown> {
    req_params.tries = 0;
    const report_id = await this._createReport(req_params);
    const report_document_id = await this._getReport(req_params, report_id);
    const report_document = await this._getReportDocument(req_params, report_document_id);
    return await this.download(report_document, req_params.download || {});
  }

  async downloadReportStream(req_params: ReportReqParams): Promise<NodeJS.ReadableStream> {
    req_params.tries = 0;
    const report_id = await this._createReport(req_params);
    const report_document_id = await this._getReport(req_params, report_id);
    const report_document = await this._getReportDocument(req_params, report_document_id);
    return await this.downloadStream(report_document, req_params.download || {});
  }

  updateCredentials(credentials?: ConfigCredentials): void {
    this._credentials = new Credentials(credentials, this._options.credentials_path, this._options.debug_log).load();
  }
}

export default SellingPartner;
