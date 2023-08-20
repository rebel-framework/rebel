import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Stack } from '../types';

export type Backend = {
  lambda: NodejsFunction;
  api: RestApi;
};

export function useBackend(
  stack: Stack,
  environment: { [key: string]: any } = {}
): Backend {
  // Create the mono lambda function
  const lambda = stack.lambda.nodeFunction('RebelMonoLambda', {
    environment: { ...environment },
  });

  // Create an API Gateway
  const api = stack.apiGateway.restApi('RebelApiGateway', {
    restApiName: 'RebelApiService',
    description: 'This service serves as a front for RebelMonoLambdaFunction.',
  });

  // Create a catch-all proxy resource
  stack.apiGateway.proxyResource(api, lambda);

  return {
    lambda,
    api,
  };
}
