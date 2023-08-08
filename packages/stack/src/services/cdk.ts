import { Stack as CloudFormationStack } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';

export default function useCDK(stack: CloudFormationStack) {
  const output = (outputName: string, outputProps: cdk.CfnOutputProps) =>
    new cdk.CfnOutput(stack, outputName, outputProps);

  return { output };
}
