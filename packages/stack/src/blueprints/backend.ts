import { Stack } from '../types';

export function backend(
  stack: Stack,
  environment: { [key: string]: any } = {}
) {
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
}
