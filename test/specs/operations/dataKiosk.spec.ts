import * as chai from 'chai';
const expect = chai.expect;

const endpoint = 'dataKiosk';

describe(endpoint, async function () {
  it('should return data kiosk queries', async function () {
    const res: any = await this.sellingPartner.callAPI({
      operation: 'getQueries',
      endpoint: endpoint
    });
    expect(res).to.be.a('object');
    expect(res.queries).to.be.a('array');
  });
});
