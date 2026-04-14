import catalogItems_v0 from './versions/catalog_items/catalogItems_v0';
import catalogItems_2020_12_01 from './versions/catalog_items/catalogItems_2020-12-01';
import catalogItems_2022_04_01 from './versions/catalog_items/catalogItems_2022-04-01';

export default {
  catalogItems: {
    __versions: ['v0', '2020-12-01', '2022-04-01'],
    __operations: ['getCatalogItem', 'listCatalogCategories', 'searchCatalogItems'],
    ...catalogItems_v0,
    ...catalogItems_2020_12_01,
    ...catalogItems_2022_04_01
  }
};
