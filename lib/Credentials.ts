import CustomError from './CustomError';
import fs from 'fs';
import os from 'os';

export interface AppClientCredentials {
  id: string;
  secret: string;
}

export interface LoadedCredentials {
  app_client: AppClientCredentials;
}

export interface ConfigCredentials {
  SELLING_PARTNER_APP_CLIENT_ID?: string;
  SELLING_PARTNER_APP_CLIENT_SECRET?: string;
  [key: string]: string | undefined;
}

class Credentials {
  private _keys: string[][];
  private _config_credentials?: ConfigCredentials;
  private _path?: string;
  private _debug_log: boolean;

  constructor(config_credentials?: ConfigCredentials, path?: string, debug_log?: boolean) {
    this._keys = [['SELLING_PARTNER_APP_CLIENT_ID'], ['SELLING_PARTNER_APP_CLIENT_SECRET']];
    this._config_credentials = config_credentials;
    this._path = path;
    this._debug_log = debug_log || false;
  }

  private _getHomeDir(): string | undefined {
    const env = process.env;
    const home_dir =
      env.HOME || env.USERPROFILE || (env.HOMEPATH ? (env.HOMEDRIVE || 'C:/') + env.HOMEPATH : null);
    if (home_dir) {
      return home_dir;
    }
    if (typeof os.homedir === 'function') {
      return os.homedir();
    }
    return undefined;
  }

  private _extractFromFile(credentials_file: string): Record<string, string> {
    let file_content = fs.readFileSync(credentials_file);
    const content = file_content.toString();
    const lines = content.split('\n');
    const found_credentials: Record<string, string> = {};
    lines.forEach((line) => {
      const line_split = line.split('=');
      const key = line_split[0].trim();
      if (line_split.length === 2 && this._keys.some((keyOptions) => keyOptions.includes(key))) {
        found_credentials[key] = line_split[1].trim();
      }
    });
    return found_credentials;
  }

  private _extractFromEnvVars(): Record<string, string> {
    const found_credentials: Record<string, string> = {};
    this._keys.forEach((keyOptions) => {
      keyOptions.forEach((key) => {
        const value = process.env[key.trim()];
        if (value) {
          found_credentials[key.trim()] = value.trim();
        }
      });
    });
    return found_credentials;
  }

  // Loading credentials in the following precedence:
  // 1. Explicitly set via SellingPartner class constructor
  // 2. Credentials file
  // 3. Environment variables
  load(): LoadedCredentials {
    let credentials_type = 'config object';
    let loaded_credentials: Record<string, string | undefined> | undefined = this._config_credentials;
    if (!loaded_credentials) {
      try {
        const credentials_file = this._path ? this._path : `${this._getHomeDir()}/.amzspapi/credentials`;
        credentials_type = `file (${credentials_file})`;
        loaded_credentials = this._extractFromFile(credentials_file);
      } catch (e) {
        credentials_type = 'environment variables';
        loaded_credentials = this._extractFromEnvVars();
      }
    }
    const missing_credentials = this._keys.filter((keyOptions) => {
      return !keyOptions.some((key) => Object.keys(loaded_credentials!).includes(key));
    });
    if (missing_credentials.length) {
      throw new CustomError({
        code: 'CREDENTIALS_MISSING',
        message: `"Could not find the following credentials in ${credentials_type} : ${missing_credentials
          .map((keyOptions) => keyOptions.join(' or '))
          .join(',')}`
      });
    }
    if (this._debug_log) {
      console.log(`Loaded credentials from ${credentials_type}`);
    }
    return {
      app_client: {
        id: loaded_credentials['SELLING_PARTNER_APP_CLIENT_ID'] as string,
        secret: loaded_credentials['SELLING_PARTNER_APP_CLIENT_SECRET'] as string
      }
    };
  }
}

export default Credentials;
