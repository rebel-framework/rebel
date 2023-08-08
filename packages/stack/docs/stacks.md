# Stacks

## Cognito

```ts
import { useStack } from '@rebel/core';

const myApp = useStack('MyApp');

const userPool = myApp.userPool('MyUserPool', {
  selfSignUpEnabled: true,
  autoVerify: { email: true },
  signInAliases: { email: true },
});

const userPoolClient = myApp.userPoolClient('MyUserPoolClient', userPool);

const identityPool = myApp.identityPool('MyIdentityPool', {
  allowUnauthenticatedIdentities: false,
  cognitoIdentityProviders: [
    {
      clientId: userPoolClient.userPoolClientId,
      providerName: userPool.userPoolProviderName,
    },
  ],
});

myApp.deploy();
```

## CloudWatch Alarms

```ts
import { useStack } from '@rebel/core';
import * as CloudWatch from 'aws-cdk-lib/aws-cloudwatch';
import * as Lambda from 'aws-cdk-lib/aws-lambda';

const myApp = useStack('MyApp');

const myFunction = myApp.lambda('MyFunction', {
  runtime: Lambda.Runtime.NODEJS_12_X,
  code: Lambda.Code.fromInline(
    'exports.handler = function(event, ctx, cb) { return cb(null, "hi"); }'
  ),
  handler: 'index.handler',
});

const errorMetric = myFunction.metricErrors();
const alarm = myApp.alarm('MyFunctionErrorsAlarm', errorMetric, {
  threshold: 1,
  evaluationPeriods: 1,
});

myApp.deploy();
```
