import reports_2021_06_30 from './versions/reports/reports_2021-06-30';

export default {
  reports: {
    __versions: ['2021-06-30'],
    __operations: [
      'getReports',
      'createReport',
      'getReport',
      'cancelReport',
      'getReportSchedules',
      'createReportSchedule',
      'getReportSchedule',
      'cancelReportSchedule',
      'getReportDocument'
    ],
    ...reports_2021_06_30
  }
};
