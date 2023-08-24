import { root } from '@rebel-framework/core';
import { Duration, Stack as CloudFormationStack } from 'aws-cdk-lib';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export default function useLambda(stack: CloudFormationStack) {
  const lambdaFunction = (name: string, props: any) =>
    new Lambda.Function(stack, name, {
      functionName: name,
      code: Lambda.Code.fromAsset(root('build/backend')),
      runtime: Lambda.Runtime.NODEJS_18_X,
      handler: 'handler.handler',
      ...props,
    });

  const externalModules = ['aws-cdk', 'aws-cdk-lib'];

  const nodeFunction = (name: string, props: any) =>
    new NodejsFunction(stack, name, {
      runtime: Lambda.Runtime.NODEJS_18_X,
      timeout: Duration.seconds(10), // Optionally set a timeout
      memorySize: 128, // Optionally set the amount of memory allocated
      bundling: {
        minify: false,
        // externalModules: externalModules,
      },
      ...props,
    });

  return { lambdaFunction, nodeFunction };
}
