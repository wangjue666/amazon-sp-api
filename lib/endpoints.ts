// For a list of required and optional body, query or path parameters for resources please see official references:
// --> https://github.com/amzn/selling-partner-api-docs/tree/main/references

import amazonWarehousingAndDistribution from './resources/amazonWarehousingAndDistribution';
import aplusContent from './resources/aplusContent';
import appIntegrations from './resources/appIntegrations';
import applicationManagement from './resources/applicationManagement';
import catalogItems from './resources/catalogItems';
import customerFeedback from './resources/customerFeedback';
import dataKiosk from './resources/dataKiosk';
import easyShip from './resources/easyShip';
import externalFulfillmentInventory from './resources/externalFulfillmentInventory';
import externalFulfillmentReturns from './resources/externalFulfillmentReturns';
import externalFulfillmentShipping from './resources/externalFulfillmentShipping';
import fbaInboundEligibility from './resources/fbaInboundEligibility';
import fbaInventory from './resources/fbaInventory';
import feeds from './resources/feeds';
import finances from './resources/finances';
import fulfillmentInbound from './resources/fulfillmentInbound';
import fulfillmentOutbound from './resources/fulfillmentOutbound';
import invoices from './resources/invoices';
import listingsItems from './resources/listingsItems';
import listingsRestrictions from './resources/listingsRestrictions';
import merchantFulfillment from './resources/merchantFulfillment';
import messaging from './resources/messaging';
import notifications from './resources/notifications';
import orders from './resources/orders';
import productFees from './resources/productFees';
import productPricing from './resources/productPricing';
import productTypeDefinitions from './resources/productTypeDefinitions';
import replenishment from './resources/replenishment';
import reports from './resources/reports';
import sales from './resources/sales';
import sellers from './resources/sellers';
import sellerWallet from './resources/sellerWallet';
import services from './resources/services';
import shipmentInvoicing from './resources/shipmentInvoicing';
import shipping from './resources/shipping';
import solicitations from './resources/solicitations';
import supplySources from './resources/supplySources';
import tokens from './resources/tokens';
import transfers from './resources/transfers';
import uploads from './resources/uploads';
import vehicles from './resources/vehicles';
import vendorDirectFulfillmentInventory from './resources/vendorDirectFulfillmentInventory';
import vendorDirectFulfillmentOrders from './resources/vendorDirectFulfillmentOrders';
import vendorDirectFulfillmentPayments from './resources/vendorDirectFulfillmentPayments';
import vendorDirectFulfillmentSandboxTestData from './resources/vendorDirectFulfillmentSandboxTestData';
import vendorDirectFulfillmentShipping from './resources/vendorDirectFulfillmentShipping';
import vendorDirectFulfillmentTransactions from './resources/vendorDirectFulfillmentTransactions';
import vendorInvoices from './resources/vendorInvoices';
import vendorOrders from './resources/vendorOrders';
import vendorShipments from './resources/vendorShipments';
import vendorTransactionStatus from './resources/vendorTransactionStatus';
import type { ReqParams } from './utils';

export interface EndpointVersionOperations {
  [operation: string]: (req_params: ReqParams) => ReqParams;
}

export interface EndpointDefinition {
  __versions: string[];
  __operations: string[];
  [version: string]: EndpointVersionOperations | string[] | unknown;
}

export interface Endpoints {
  [endpoint: string]: EndpointDefinition;
}

const endpoints: Endpoints = {
  ...amazonWarehousingAndDistribution,
  ...aplusContent,
  ...appIntegrations,
  ...applicationManagement,
  ...catalogItems,
  ...customerFeedback,
  ...dataKiosk,
  ...easyShip,
  ...externalFulfillmentInventory,
  ...externalFulfillmentReturns,
  ...externalFulfillmentShipping,
  ...fbaInboundEligibility,
  ...fbaInventory,
  ...feeds,
  ...finances,
  ...fulfillmentInbound,
  ...fulfillmentOutbound,
  ...invoices,
  ...listingsItems,
  ...listingsRestrictions,
  ...merchantFulfillment,
  ...messaging,
  ...notifications,
  ...orders,
  ...productFees,
  ...productPricing,
  ...productTypeDefinitions,
  ...replenishment,
  ...reports,
  ...sales,
  ...sellers,
  ...sellerWallet,
  ...services,
  ...shipmentInvoicing,
  ...shipping,
  ...solicitations,
  ...supplySources,
  ...tokens,
  ...transfers,
  ...uploads,
  ...vehicles,
  ...vendorDirectFulfillmentInventory,
  ...vendorDirectFulfillmentOrders,
  ...vendorDirectFulfillmentPayments,
  ...vendorDirectFulfillmentSandboxTestData,
  ...vendorDirectFulfillmentShipping,
  ...vendorDirectFulfillmentTransactions,
  ...vendorInvoices,
  ...vendorOrders,
  ...vendorShipments,
  ...vendorTransactionStatus
};

export default endpoints;
