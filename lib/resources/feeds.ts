import feeds_2021_06_30 from './versions/feeds/feeds_2021-06-30';

export default {
  feeds: {
    __versions: ['2021-06-30'],
    __operations: ['getFeeds', 'createFeed', 'getFeed', 'cancelFeed', 'createFeedDocument', 'getFeedDocument'],
    ...feeds_2021_06_30
  }
};
