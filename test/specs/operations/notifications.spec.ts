import { SellingPartner } from '../../../index';
import * as chai from 'chai';
const expect = chai.expect;

const endpoint = 'notifications';

describe(endpoint, async function () {
  let subscription_id: string | undefined;
  let destination_id: string | undefined;
  let spClient: InstanceType<typeof SellingPartner>;

  it('should return subscriptions for any offer changed', async function () {
    spClient = new SellingPartner({
      region: this.config.region,
      refresh_token: this.config.refresh_token,
      access_token: this.config.access_token,
      options: {
        auto_request_tokens: false
      }
    });
    try {
      const res: any = await spClient.callAPI({
        operation: 'getSubscription',
        endpoint: endpoint,
        path: {
          notificationType: 'ANY_OFFER_CHANGED'
        }
      });
      expect(res).to.be.a('object');
      expect(res.subscriptionId).to.be.a('string');
      expect(res.payloadVersion).to.be.a('string');
      expect(res.destinationId).to.be.a('string');
      if (res.subscriptionId) {
        subscription_id = res.subscription_id;
        destination_id = res.destination_id;
      }
    } catch (e: any) {
      expect(e).to.have.property('details');
      expect(e.details).to.include("Subscription doesn't exist for notification type");
    }
  });

  it('should return subscriptions for subscription id', async function () {
    if (subscription_id) {
      try {
        await spClient.refreshAccessToken('sellingpartnerapi::notifications');
        const res: any = await spClient.callAPI({
          operation: 'getSubscriptionById',
          endpoint: endpoint,
          path: {
            subscriptionId: subscription_id,
            notificationType: 'ANY_OFFER_CHANGED'
          }
        });
        expect(res).to.be.a('object');
        expect(res.subscriptionId).to.be.a('string');
        expect(res.payloadVersion).to.be.a('string');
        expect(res.destinationId).to.be.a('string');
      } catch (e: any) {
        expect(e).to.have.property('details');
        expect(e.details).to.include("Subscription doesn't exist for notification type");
      }
    } else {
      this.skip();
    }
  });

  it('should return destinations', async function () {
    await spClient.refreshAccessToken('sellingpartnerapi::notifications');
    const res: any = await spClient.callAPI({
      operation: 'getDestinations',
      endpoint: endpoint
    });
    expect(res).to.be.a('array');
    if (res.length && res[0].destinationId) {
      destination_id = res[0].destination_id;
    }
  });

  it('should return destination for destination id', async function () {
    if (destination_id) {
      try {
        await spClient.refreshAccessToken('sellingpartnerapi::notifications');
        const res: any = await spClient.callAPI({
          operation: 'getDestination',
          endpoint: endpoint,
          path: {
            destinationId: destination_id
          }
        });
        expect(res).to.be.a('object');
        expect(res.subscriptionId).to.be.a('string');
        expect(res.payloadVersion).to.be.a('string');
        expect(res.destinationId).to.be.a('string');
      } catch (e: any) {
        expect(e).to.have.property('details');
        expect(e.details).to.include("Subscription doesn't exist for notification type");
      }
    } else {
      this.skip();
    }
  });
});
