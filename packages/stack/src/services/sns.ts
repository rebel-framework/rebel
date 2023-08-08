import { Stack as CloudFormationStack } from 'aws-cdk-lib';
import * as SNS from 'aws-cdk-lib/aws-sns';
import * as Subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as SQS from 'aws-cdk-lib/aws-sqs';

export default function useSNS(stack: CloudFormationStack) {
  const topic = (topicName: string) => new SNS.Topic(stack, topicName);

  const subscription = (topic: SNS.Topic, queue: SQS.Queue) =>
    topic.addSubscription(new Subs.SqsSubscription(queue));

  return { topic, subscription };
}
