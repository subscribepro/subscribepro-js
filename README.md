# Subscribe Pro JavaScript Client

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/subscribepro/subscribepro-js/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/subscribepro/subscribepro-js/tree/main)

This is our JavaScript client library for accessing the Subscribe Pro REST API. Our API documentation is available at https://docs.subscribepro.com/technical/rest-api/.

To learn more about Subscribe Pro you can visit us at https://www.subscribepro.com/.

## Installation

This library is packaged as an [NPM package](https://www.npmjs.com/package/subscribepro). You can install with NPM through the standard method:

```
npm install @subscribepro/sdk
```

If you are using YARN you add this library to your package.json with:

```
yarn add @subscribepro/sdk
```

## Usage

As this is packaged as a standard NPM typescript module the import should be familiar:

```javascript
import { SubscribePro } from '@subscribepro/sdk';

SubscribePro.configure({
  accessToken: 'ACCESS_TOKEN',
  environmentKey: 'ENVIRONMENT_KEY'
})
```

The API is split in to two versions that reflect the SubscribePro API versioning. The V2 and V3 APIs have overlapping functionality, but there are capabilities that can only be found in one or the other. The definitive documentation can be found on the SubscribePro docs:

- [V1 and V2 API Docs](https://api.subscribepro.com/docs/rest) (With the exception of the vault endpoints which are both V1 and V2, all endpoints are V2)
- [V3 API Docs](https://api.subscribepro.com/docs)

### Example (Retrieve and Update a Product V2 API)

```javascript
import { SubscribePro } from '@subscribepro/sdk';

SubscribePro.configure({
  accessToken: 'ACCESS_TOKEN',
  environmentKey: 'ENVIRONMENT_KEY'
})

let product = SubscribePro.V2.Products.getOne({id: '12345'});
SubscribePro.V2.Products.updateOne({id: product.id, data: {name: `${product.name} (2022)`}});
```

## License

[MIT](LICENSE)