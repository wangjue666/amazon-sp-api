import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env.test') });

export interface TestConfig {
  region: 'eu' | 'na' | 'fe';
  refresh_token: string | undefined;
  app_client: {
    id: string | undefined;
    secret: string | undefined;
  };
  marketplace_id: string | undefined;
  asin: string | undefined;
  asin2: string | undefined;
  sku: string | undefined;
  sku2: string | undefined;
  country_code: string | undefined;
  currency_code: string | undefined;
  order_id: string | undefined;
  seller_id: string | undefined;
  access_token?: string;
  role_credentials?: unknown;
}

const config: TestConfig = {
  region: (process.env.REGION || 'na') as 'eu' | 'na' | 'fe',
  refresh_token: process.env.REFRESH_TOKEN,
  app_client: {
    id: process.env.SELLING_PARTNER_APP_CLIENT_ID,
    secret: process.env.SELLING_PARTNER_APP_CLIENT_SECRET
  },
  marketplace_id: process.env.MARKETPLACE_ID,
  asin: process.env.ASIN,
  asin2: process.env.ASIN2,
  sku: process.env.SKU,
  sku2: process.env.SKU2,
  country_code: process.env.COUNTRY_CODE,
  currency_code: process.env.CURRENCY_CODE,
  order_id: process.env.ORDER_ID,
  seller_id: process.env.SELLER_ID
};

export default config;
