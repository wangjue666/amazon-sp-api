import CustomError from './CustomError';

export interface PathRequirements {
  [param: string]: {
    type: string;
    enum?: string[];
  };
}

export interface ReqParams {
  path?: Record<string, string>;
  query?: Record<string, unknown>;
  body?: unknown;
  method?: string;
  api_path?: string;
  restore_rate?: number;
  operation?: string;
  endpoint?: string;
  scope?: string;
  encode_twice?: boolean;
  deprecation_date?: string;
  sandbox_only?: boolean;
  restricted_data_token?: string;
  headers?: Record<string, string>;
  timeouts?: { response?: number; idle?: number; deadline?: number };
  options?: {
    version?: string;
    restore_rate?: number;
    raw_result?: boolean;
    timeouts?: { response?: number; idle?: number; deadline?: number };
  };
  // Report-related fields
  version?: string;
  tries?: number;
  interval?: number;
  cancel_after?: number;
  download?: DownloadOptions;
  [key: string]: unknown;
}

export interface DownloadOptions {
  json?: boolean;
  unzip?: boolean;
  file?: string;
  charset?: string;
  timeouts?: { response?: number; idle?: number; deadline?: number };
}

interface PrintWarningMap {
  DEPRECATION: (deprecation_date: string) => void;
  SANDBOX_ONLY: (operation: string) => void;
  [key: string]: (params: string) => void;
}

// encodeURIComponent is not encoding chars !'()* by default, but SP endpoints expect these to be encoded once!
export function encodeSpecialChars(str: string): string {
  return str.replace(/[!'()*]/g, (c) => {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

export function spEncodeURIComponent(str: string): string {
  return encodeSpecialChars(encodeURIComponent(str));
}

// Two operations (getPricing, getCompetitivePricing) of productPricing endpoint require double encoding for query params
// --> for array values we need to make sure that ',' delimiter is only encoded once, so we replace '%2C' with ','
export function doubleEncodeURICompenent(str: string, key_is_array: boolean): string {
  return key_is_array
    ? spEncodeURIComponent(spEncodeURIComponent(str).replace(/%2C/g, ','))
    : spEncodeURIComponent(spEncodeURIComponent(str));
}

// Check if all required path parameters are given
// --> not necessary for body or querystring as SP API error messages are meaningful enough
export function checkAndEncodeParams(req_params: ReqParams, requirements: { path: PathRequirements }): ReqParams {
  if (!req_params || !req_params.path) {
    throw new CustomError({
      code: 'NO_PATH_FOUND',
      message: `Please provide the following path parameters: ${Object.keys(requirements.path).join(',')}`
    });
  }
  for (const param in requirements.path) {
    if (!req_params.path[param]) {
      throw new CustomError({
        code: 'REQUIRED_PATH_PARAMETER_NOT_FOUND',
        message: `Please provide the following path parameter: ${param}`
      });
    } else if (
      requirements.path[param].type === 'enum' &&
      requirements.path[param].enum &&
      !requirements.path[param].enum!.includes(req_params.path[param])
    ) {
      throw new CustomError({
        code: 'INVALID_PATH_PARAMETER_VALUE',
        message: `Invalid value ${req_params.path[param]} for path parameter ${param}`
      });
    }
    req_params.path[param] = spEncodeURIComponent(req_params.path[param]);
  }
  return req_params;
}

const printWarning: PrintWarningMap = {
  DEPRECATION: (deprecation_date: string): void => {
    console.warn(
      `WARNING! This operation will be deprecated on ${deprecation_date}! You should update the operation and/or the version of the endpoint to use.`
    );
    return;
  },
  SANDBOX_ONLY: (operation: string): void => {
    console.warn(`SANDBOX ONLY! The operation '${operation}' is only available for sandbox endpoints.`);
  }
};

export function warn(warn_type: string, params: string): void {
  const overwrite = printWarning[warn_type](params);
  // Overwrite original function definition --> this will ensure that warning is printed only once
  if (overwrite) printWarning[warn_type] = () => {};
}
