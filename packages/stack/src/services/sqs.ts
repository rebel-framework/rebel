import * as SQS from 'aws-cdk-lib/aws-sqs';
import { Stack as CloudFormationStack } from 'aws-cdk-lib';

export default function useSQS(stack: CloudFormationStack) {
  const queue = (queueName: string, queueProps: SQS.QueueProps) =>
    new SQS.Queue(stack, queueName, queueProps);

  return { queue };
}
