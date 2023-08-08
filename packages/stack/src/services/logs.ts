import { Stack as CloudFormationStack } from 'aws-cdk-lib';
import * as Logs from 'aws-cdk-lib/aws-logs';

export default function useLogs(stack: CloudFormationStack) {
  const logGroup = (logGroupName: string, logGroupProps: Logs.LogGroupProps) =>
    new Logs.LogGroup(stack, logGroupName, logGroupProps);

  return { logGroup };
}
