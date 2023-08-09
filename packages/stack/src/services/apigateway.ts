import { Stack as CloudFormationStack } from 'aws-cdk-lib';
import * as ApiGateway from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

export default function useApiGateway(stack: CloudFormationStack) {
  const restApi = (apiName: string, apiProps: ApiGateway.RestApiProps) =>
    new ApiGateway.RestApi(stack, apiName, apiProps);

  const resource = (
    api: ApiGateway.RestApi,
    pathPart: string,
    parent?: ApiGateway.IResource
  ) => (parent ? parent.addResource(pathPart) : api.root.addResource(pathPart));

  const proxyResource = (
    api: ApiGateway.RestApi,
    lambda: NodejsFunction
  ): ApiGateway.Resource => {
    // Create a catch-all proxy resource
    const res = api.root.addResource('{proxy+}');

    // Add a ANY method to the catch-all proxy resource, connected to your Lambda function
    res.addMethod('ANY', new LambdaIntegration(lambda));

    // Add CORS options to this resource
    res.addCorsPreflight({
      allowOrigins: ApiGateway.Cors.ALL_ORIGINS,
      allowMethods: ApiGateway.Cors.ALL_METHODS,
      allowHeaders: ['*'], // Or specify certain headers if needed
    });

    return res;
  };

  const method = (
    resource: ApiGateway.IResource,
    httpMethod: string,
    integration: ApiGateway.Integration,
    methodOptions?: ApiGateway.MethodOptions
  ) => resource.addMethod(httpMethod, integration, methodOptions);

  return { restApi, resource, proxyResource, method };
}
