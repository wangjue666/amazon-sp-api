export interface CustomErrorParams {
  code?: string;
  message?: string;
  type?: string;
  details?: string;
  timeout?: number;
  stacktrace?: string;
  [key: string]: unknown;
}

class CustomError extends Error {
  code?: string;
  type: string;
  details?: string;
  timeout?: number;
  original_stacktrace?: string;
  [key: string]: unknown;

  constructor(err: CustomErrorParams, ...params: string[]) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    for (const key in err) {
      if (key === 'stacktrace') {
        this['original_stacktrace'] = err[key] as string;
      } else {
        (this as Record<string, unknown>)[key] = err[key];
      }
    }
    this.type = err.type ? err.type : 'error';
  }
}

export default CustomError;
