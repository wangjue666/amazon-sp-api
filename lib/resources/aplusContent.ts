import aplusContent_2020_11_01 from './versions/aplus_content/aplusContent_2020-11-01';

export default {
  aplusContent: {
    __versions: ['2020-11-01'],
    __operations: [
      'searchContentDocuments',
      'createContentDocument',
      'getContentDocument',
      'updateContentDocument',
      'listContentDocumentAsinRelations',
      'postContentDocumentAsinRelations',
      'validateContentDocumentAsinRelations',
      'searchContentPublishRecords',
      'postContentDocumentApprovalSubmission',
      'postContentDocumentSuspendSubmission'
    ],
    ...aplusContent_2020_11_01
  }
};
