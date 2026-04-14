import customerFeedback_2024_06_01 from './versions/customer_feedback/customerFeedback_2024-06-01';

export default {
  customerFeedback: {
    __versions: ['2024-06-01'],
    __operations: [
      'getItemReviewTopics',
      'getItemBrowseNode',
      'getBrowseNodeReviewTopics',
      'getItemReviewTrends',
      'getBrowseNodeReviewTrends',
      'getBrowseNodeReturnTopics',
      'getBrowseNodeReturnTrends'
    ],
    ...customerFeedback_2024_06_01
  }
};
