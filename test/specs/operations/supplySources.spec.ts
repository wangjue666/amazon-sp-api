import * as chai from 'chai';
const expect = chai.expect;

const endpoint = 'supplySources';

describe(endpoint, async function () {
  it('should return data kiosk queries', async function () {
    const res: any = await this.sellingPartner.callAPI({
      operation: 'getSupplySources',
      endpoint: endpoint
    });
    expect(res).to.be.a('object');
    expect(res.supplySources).to.be.a('array');
  });
});
