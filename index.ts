import SellingPartner from './lib/SellingPartner';

export default SellingPartner;
export { SellingPartner };

// Re-export types
export type { Config, SPOptions, DownloadDocument, DownloadStreamOptions, FeedInput, ReportReqParams, CallAPIParams } from './lib/SellingPartner';
export type { ConfigCredentials, LoadedCredentials, AppClientCredentials } from './lib/Credentials';
export type { CustomErrorParams } from './lib/CustomError';
export type { ReqParams, DownloadOptions, PathRequirements } from './lib/utils';
export type { RequestOptions, RequestResponse, SPOptions as RequestSPOptions, ApiReqParams } from './lib/Request';
export type { TimeoutOptions } from './lib/TimeoutManager';
