import vendorDirectFulfillmentInventory_v1 from './versions/vendor_direct_fulfillment_inventory/vendorDirectFulfillmentInventory_v1';

export default {
  vendorDirectFulfillmentInventory: {
    __versions: ['v1'],
    __operations: ['submitInventoryUpdate'],
    ...vendorDirectFulfillmentInventory_v1
  }
};
