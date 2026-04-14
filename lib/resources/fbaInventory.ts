import fbaInventory_v1 from './versions/fba_inventory/fbaInventory_v1';

export default {
  fbaInventory: {
    __versions: ['v1'],
    __operations: ['getInventorySummaries', 'createInventoryItem', 'deleteInventoryItem', 'addInventory'],
    ...fbaInventory_v1
  }
};
