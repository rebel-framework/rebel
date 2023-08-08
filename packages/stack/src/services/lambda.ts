import { Duration, Stack as CloudFormationStack } from 'aws-cdk-lib';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export default function useLambda(stack: CloudFormationStack) {
  const nodeFunction = (name: string, props: Lambda.FunctionProps) =>
    new NodejsFunction(stack, name, {
      ...props,
      handler: 'handler',
      runtime: Lambda.Runtime.NODEJS_18_X,
      timeout: Duration.seconds(10), // Optionally set a timeout
      memorySize: 256, // Optionally set the amount of memory allocated
    });

  return { nodeFunction };
}
