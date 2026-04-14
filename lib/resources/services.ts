import services_v1 from './versions/services/services_v1';

export default {
  services: {
    __versions: ['v1'],
    __operations: [
      'getServiceJobByServiceJobId',
      'cancelServiceJobByServiceJobId',
      'completeServiceJobByServiceJobId',
      'getServiceJobs',
      'addAppointmentForServiceJobByServiceJobId',
      'rescheduleAppointmentForServiceJobByServiceJobId',
      'assignAppointmentResources',
      'setAppointmentFulfillmentData',
      'getRangeSlotCapacity',
      'getFixedSlotCapacity',
      'updateSchedule',
      'createReservation',
      'updateReservation',
      'cancelReservation',
      'getAppointmentSlotsByJobId',
      'getAppointmentSlots',
      'createServiceDocumentUploadDestination'
    ],
    ...services_v1
  }
};
