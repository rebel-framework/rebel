import * as SQS from 'aws-cdk-lib/aws-sqs';
import { Stack as CloudFormationStack } from 'aws-cdk-lib';

export default function useSQS(stack: CloudFormationStack) {
  const queue = (name: string, props: SQS.QueueProps) =>
    new SQS.Queue(stack, name, props);

  return { queue };
}
