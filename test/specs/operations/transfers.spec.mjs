import * as chai from 'chai';
const expect = chai.expect;

const endpoint = 'transfers';

describe(endpoint, async function () {
  it('should return a list of payment methods', async function () {
    let res = await this.sellingPartner.callAPI({
      operation: 'getPaymentMethods',
      endpoint: endpoint,
      query: {
        marketplaceId: this.config.marketplace_id
      }
    });
    expect(res).to.be.a('object');
    expect(res.paymentMethods).to.be.a('array');
  });
});
