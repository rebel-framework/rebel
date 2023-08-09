import { root } from '@rebel/core';
import { Stack } from '../types';
import * as S3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { Stack as CloudFormationStack } from 'aws-cdk-lib';

export function backend(
  stack: Stack,
  environment: { [key: string]: any } = {}
) {
  // Create the mono lambda function
  const lambda = stack.lambda.nodeFunction('RebelMonoLambda', {
    entry: root('src/backend/handler.ts'),
    environment: { ...environment },
  });

  // Create an API Gateway
  const api = stack.apiGateway.restApi('RebelApiGateway', {
    restApiName: 'RebelApiService',
    description: 'This service serves as a front for RebelMonoLambdaFunction.',
  });

  // Create a catch-all proxy resource
  stack.apiGateway.proxyResource(api, lambda);
}
