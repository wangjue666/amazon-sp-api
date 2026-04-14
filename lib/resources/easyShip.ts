import easyShip_2022_03_23 from './versions/easy_ship/easyShip_2022-03-23';

export default {
  easyShip: {
    __versions: ['2022-03-23'],
    __operations: [
      'listHandoverSlots',
      'getScheduledPackage',
      'createScheduledPackage',
      'updateScheduledPackages',
      'createScheduledPackageBulk'
    ],
    ...easyShip_2022_03_23
  }
};
