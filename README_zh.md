# amazon-sp-api (亚马逊 Selling Partner API包装器)

封装了调用Amazon Selling Partner API。它封装了所有常用的操作，比如请求access token、security token和使用AWS4签名的签名请求。

<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README_zh.md">中文</a>
</p>

## 预备知识
确保您查阅了[销售合作伙伴API开发人员指南](https://github.com/amzn/selling-partner-api-docs/blob/main/guides/developer-guide/SellingPartnerApiDeveloperGuide.md)并成功完成了开发人员的注册步骤[注册开发者](https://github.com/amzn/selling-partner-api-docs/blob/main/guides/developer-guide/SellingPartnerApiDeveloperGuide.md#registering-as-a-developer), [注册你的SPAPI应用](https://github.com/amzn/selling-partner-api-docs/blob/main/guides/developer-guide/SellingPartnerApiDeveloperGuide.md#registering-your-selling-partner-api-application)并拥有有效的refresh令牌（如果您仅为自己的卖家帐户授权使用，最简单的方法是使用《开发人员指南》中描述的自我授权）。

## 安装
```bash
npm install amazon-sp-api
```

## 开始
在使用包装器之前，需要先添加你的spapi和aws用户token等数据。

### 在环境变量中设置凭据
* `SELLING_PARTNER_APP_CLIENT_ID`=<YOUR_APP_CLIENT_ID> ([see SP Developer Guide "Viewing your developer information"](https://github.com/amzn/selling-partner-api-docs/blob/main/guides/developer-guide/SellingPartnerApiDeveloperGuide.md#viewing-your-developer-information))
* `SELLING_PARTNER_APP_CLIENT_SECRET`=<YOUR_APP_CLIENT_SECRET> ([see SP Developer Guide "Viewing your developer information"](https://github.com/amzn/selling-partner-api-docs/blob/main/guides/developer-guide/SellingPartnerApiDeveloperGuide.md#viewing-your-developer-information))
* `AWS_SELLING_PARTNER_ACCESS_KEY_ID` or `AWS_ACCESS_KEY_ID`=<YOUR_AWS_USER_ID> ([see SP Developer Guide "Create an IAM user"](https://github.com/amzn/selling-partner-api-docs/blob/main/guides/developer-guide/SellingPartnerApiDeveloperGuide.md#step-2-create-an-iam-user))
* `AWS_SELLING_PARTNER_SECRET_ACCESS_KEY` or `AWS_SECRET_ACCESS_KEY`=<YOUR_AWS_USER_SECRET> ([see SP Developer Guide "Create an IAM user"](https://github.com/amzn/selling-partner-api-docs/blob/main/guides/developer-guide/SellingPartnerApiDeveloperGuide.md#step-2-create-an-iam-user))
* `AWS_SELLING_PARTNER_ROLE`=<YOUR_AWS_SELLING_PARTNER_API_ROLE> ([see SP Developer Guide "Create an IAM role"](https://github.com/amzn/selling-partner-api-docs/blob/main/guides/developer-guide/SellingPartnerApiDeveloperGuide.md#step-4-create-an-iam-role))

### 在文件里设置凭据
您可以从凭证文件加载凭证代替通过环境变量设置凭证。文件的默认路径是 ~/.amzspapi/credentials（创建包装器时可以更改文件路径），您可以每行添加一个凭据:
```bash
SELLING_PARTNER_APP_CLIENT_ID=<YOUR_APP_CLIENT_ID>
SELLING_PARTNER_APP_CLIENT_SECRET=<YOUR_APP_CLIENT_SECRET>
AWS_ACCESS_KEY_ID=<YOUR_AWS_USER_ID>
AWS_SECRET_ACCESS_KEY=<YOUR_AWS_USER_SECRET>
AWS_SELLING_PARTNER_ROLE=<YOUR_AWS_SELLING_PARTNER_API_ROLE>
```

### 在构造函数config对象设置凭据
尽管设置凭据的最方便和推荐的方法是通过环境变量或配置文件，但在创建客户机实例时，也可以在config对象内传递凭据（即，如果无法使用环境变量或文件来配置）。下面将解释构造函数config对象的结构。

## 用法
引入包:
```javascript
const SellingPartnerAPI = require('amazon-sp-api');
```

创建包装器并调用接口:
```javascript
(async() => {
  try {
    let sellingPartner = new SellingPartnerAPI({
      region:'eu', // The region of the selling partner API endpoint ("eu", "na" or "fe")
      refresh_token:'<YOUR_REFRESH_TOKEN>' // The refresh token of your app user
    });
    let res = await sellingPartner.callAPI({
      operation:'getMarketplaceParticipations'
    });
    console.log(res);
  } catch(e){
    console.log(e);
  }
})();
```

### Config 对象参数

类构造函数 config对象 如下:
```javascript
{
  region:'eu', // Required, the region of the selling partner API endpoint ("eu", "na" or "fe")
  refresh_token:'<YOUR_REFRESH_TOKEN>', // Required, the refresh token of your app user
  access_token:'<YOUR_ACCESS_TOKEN>', // Optional, the access token requested with the refresh token of the app user
  role_credentials:{ 
    id:'<YOUR_TEMPORARY_ROLE_ACCESS_ID>', // Optional, the temporary access id for the sp api role of the iam user
    secret:'<YOUR_TEMPORARY_ROLE_ACCESS_SECRET>', // Optional, the temporary access secret for the sp api role of the iam user
    security_token:'<YOUR_TEMPORARY_ROLE_SECURITY_TOKEN>' // Optional, the temporary security token for the sp api role of the iam user
  },
  options:{
    credentials_path:'<YOUR_CUSTOM_ABSOLUTE_PATH>', // Optional, a custom absolute path to your credentials file location
    auto_request_tokens:true, // Optional, whether or not the client should retrieve new access and role credentials if non given or expired. Default is true
    auto_request_throttled:true, // Optional, whether or not the client should automatically retry a request when throttled. Default is true
    use_sandbox:false // Optional, whether or not the client should automatically retry a request when throttled. Default is false
  },
  // Optional: Your app client and aws user credentials
  // --> should only be used if you have no means of using environment vars or credentials file
  credentials:{
    SELLING_PARTNER_APP_CLIENT_ID:'<YOUR_APP_CLIENT_ID>',
    SELLING_PARTNER_APP_CLIENT_SECRET:'<YOUR_APP_CLIENT_SECRET>',
    AWS_ACCESS_KEY_ID:'<YOUR_AWS_USER_ID>',
    AWS_SECRET_ACCESS_KEY:'<YOUR_AWS_USER_SECRET>',
    AWS_SELLING_PARTNER_ROLE:'<YOUR_AWS_SELLING_PARTNER_API_ROLE>'
  }
}
```
如果您只提供所需的参数（region和refresh token）,包装器将自动为您请求访问access_token和role_credentials（TTL为1小时）, 之后对该类实例的api调用中会重用这些凭据。

如果要对多个实例使用相同的凭据，可以通过getter检索它们，并将它们用作新实例的输入：
```javascript
let access_token = sellingPartner.access_token;
let role_credentials = sellingPartner.role_credentials;

let sellingPartnerNewInstance = new SellingPartnerAPI({
  region:'eu',
  refresh_token:'<YOUR_REFRESH_TOKEN>',
  access_token:access_token,
  role_credentials:role_credentials
});
```

### 手动请求 token 和 role credentials

您也可以手动刷新它们，而不是让包装器自动处理访问token和role credentials请求:
```javascript
let sellingPartner = new SellingPartnerAPI({
  region:'eu',
  refresh_token:'<YOUR_REFRESH_TOKEN>',
  options:{
    auto_request_tokens:false
  }
});
await sellingPartner.refreshAccessToken();
await sellingPartner.refreshRoleCredentials();
```

## 调用接口

**.callAPI()** 使用object作为输入:
* `operation`: 必填, 要请求的 operation 类型 [查看SP API References](https://github.com/amzn/selling-partner-api-docs/tree/main/references)
* `path`: 添加到 path 对象上的参数
* `query`: 添加到 query 对象上的参数
* `body`: 添加到 body 对象上的参数

### Examples
```javascript
let res = await sellingPartner.callAPI({
  operation:'getOrderMetrics',
  query:{
    marketplaceIds:['A1PA6795UKMFR9'],
    interval:'2020-10-01T00:00:00-07:00--2020-10-01T20:00:00-07:00',
    granularity:'Hour'
  }
});
```
```javascript
let res = await sellingPartner.callAPI({
  operation:'getCatalogItem',
  path:{
    asin:'B084J4QQFT'
  },
  query:{
    MarketplaceId:'A1PA6795UKMFR9'
  }
});
```
```javascript
let res = await sellingPartner.callAPI({
  operation:'createReport',
  body:{
    reportType:'GET_FLAT_FILE_OPEN_LISTINGS_DATA',
    marketplaceIds:['A1PA6795UKMFR9']
  }
});
```

## Download, decrypt and unzip reports

The **.download()** function takes the download details (url and encryption details) received from a "getReportDocument" operation as input, downloads the content, unzips it (if result is compressed), decrypts it and returns it.
You may also include an options object to enable a json result or to additionally save the report to a file.
Retrieve the download details from a "getReportDocument" operation:
```javascript
let report_document = await sellingPartner.callAPI({
  operation:'getReportDocument',
  path:{
    reportDocumentId:'<REPORT_DOCUMENT_ID>' // retrieve the reportDocumentId from a "getReport" operation (when processingStatus of report is "DONE")
  }
});
```
The structure of the returned report_document should look like this:
```javascript
{
  reportDocumentId:'<REPORT_DOCUMENT_ID>',
  compressionAlgorithm:'GZIP', // Only included if report is compressed
  encryptionDetails:{
    standard:'AES',
    initializationVector:'<INITIALIZATION_VECTOR>',
    key:'<KEY>'
  },
  url: '<REPORT_DOWNLOAD_URL>' // Expires after 5 minutes!
}
```
Call the .download() function to receive the content of the report. The default without any config options will download, decrypt and unzip the content and return it without reformatting or saving it to the disk:
```javascript
let report = await sellingPartner.download(report_document);
```
The options object has three optional properties:
* `json`: true/false, whether or not the content should be transformed to json before returning it (from tab delimited flat-file or XML). Defaults to false. IMPORTANT: is ignored when unzip is set to false.
* `unzip`: true/false, whether or not the content should be unzipped before returning it. Defaults to true. 
* `file`: absolute file path to save the report to. Defaults to not saving to disk. IMPORTANT: Even when saved to disk the report content is still returned.

The following call will download the report, transform it to json and save it to disk:
```javascript
let report = await sellingPartner.download(report_document, {
  json:true,
  file:'<YOUR_ABSOLUTE_FILE_PATH>/report.json'
});
```

## Encrypt and upload feeds

The **.upload()** function takes the feed upload details (url and encryption details) received from a "createFeedDocument" operation, the feed content and its content type to upload as input, encrypts the content and uploads it.
Start by creating a feed object with the following properties:
* `content`: Required if "file" is not provided, the content to upload as a string.
* `file`: Required if "content" is not provided, the absolute file path of the document to upload. IMPORTANT: Is ignored if "content" is provided
* `contentType`: Required, the contentType of the content to upload (should be one of "text/xml" or "text/tab-separated-values" and the charset of the content, i.e. "text/xml; charset=utf-8").

This will create an inventory feed ("POST_INVENTORY_AVAILABILITY_DATA") that will update the quantity of a given SKU to 10:
```javascript
let feed = {
  content:`<?xml version="1.0" encoding="utf-8"?>
    <AmazonEnvelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="amzn-envelope.xsd">
      <Header>
        <DocumentVersion>1.02</DocumentVersion>
        <MerchantIdentifier>YOUR_MERCHANT_IDENTIFIER</MerchantIdentifier>
      </Header>
      <MessageType>Inventory</MessageType>
      <Message>
        <MessageID>1</MessageID>
        <Inventory>
          <SKU>YOUR_SKU</SKU>
          <Quantity>10</Quantity>
        </Inventory>
      </Message>
    </AmazonEnvelope>`,
  contentType:'text/xml; charset=utf-8'
};
```
Before you can upload the feed you need to retrieve the feed upload details from a "createFeedDocument" operation:
```javascript
let feed_upload_details = await sellingPartner.callAPI({
  operation:'createFeedDocument',
  body:{
    contentType:feed.contentType
  }
});
```
Call the .upload() function to encrypt and upload the content of the feed:
```javascript
let res = await sellingPartner.upload(feed_upload_details, feed);
```
After uploading the feed you have to trigger the processing of the feed by calling the "createFeed" operation with the necessary params (marketplaceIds, feedType and inputFeedDocumentId):
```javascript
let feed_creation_infos = await sellingPartner.callAPI({
  operation:'createFeed',
  body:{
    marketplaceIds:['A1PA6795UKMFR9'],
    feedType:'POST_INVENTORY_AVAILABILITY_DATA',
    inputFeedDocumentId:feed_upload_details.feedDocumentId // retrieve the feedDocumentId from the "createFeedDocument" operation
  }
});
```
IMPORTANT: Although uploading and creating the feed was successful it doesn't mean that the processing of the feed itself was also successful. You can check the result of the feed once it has been processed by downloading the processing result with the **.download()** function quite similar as how to download reports. Use the feedId returned by the "createFeed" operation and call the "getFeed" operation, which will include a resultFeedDocumentId if feed processing is already done. The resultFeedDocumentId can be used with a "getFeedDocument" operation that will return the feed download details needed for the feed result download.

## Sandbox mode
You can easily enable sandbox mode by setting the use_sandbox in the constructor config options to true. When using the sandbox you have to make sure to use the correct request parameters for the operation you want to test. You can find these inside the [api models definitions](https://github.com/amzn/selling-partner-api-models/tree/main/models) by searching the corresponding json file for "x-amazon-spds-sandbox-behaviors".
For example, this will test the "listCatalogItems" operation in sandbox mode:
```javascript
let res = await sellingPartner.callAPI({
  operation:'listCatalogItems',
  query:{
    MarketplaceId:'TEST_CASE_200',
    SellerSKU:'SKU_200'
  }
});
```

## Known Issues
Since the Selling Partner API is still pretty new, not all API paths and endpoints have been tested for full functionality. If you find any calls not working please open up a new issue.

Some operations don't seem to be heavy-use resistant yet, i.e. the "listCatalogItems" operation throws an "InteralFailure" error (statusCode 500) if used repetitive (although restore rate of operation is respected).
