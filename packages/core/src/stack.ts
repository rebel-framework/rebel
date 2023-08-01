import { App, Stack, StackProps, Duration } from 'aws-cdk-lib';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import * as ApiGateway from 'aws-cdk-lib/aws-apigateway';
import * as DynamoDB from 'aws-cdk-lib/aws-dynamodb';
import * as S3 from 'aws-cdk-lib/aws-s3';
import * as S3Deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as CloudFront from 'aws-cdk-lib/aws-cloudfront';
import * as SNS from 'aws-cdk-lib/aws-sns';
import * as Subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as SQS from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

// const app = () => {
//   // Get the current working directory
//   const currentDirectory = process.cwd();

//   // Optionally, you can resolve the absolute path if needed.
//   const absolutePath = path.resolve(currentDirectory);

//   // const fileToImportAsJavascript = `${absolutePath}/bin/backend/index.js`;
//   const commandFilePath = path.resolve(`${absolutePath}/bin/backend/commands`);
//   `${commandFilePath}.rebel/cdk/out`;
// };

export const useStack = (stackName: string, stackProps?: StackProps) => {
  const app = new App();
  const stack = new Stack(app, stackName, stackProps);

  const queue = (queueName: string, queueProps: SQS.QueueProps) =>
    new SQS.Queue(stack, queueName, queueProps);

  const topic = (topicName: string) => new SNS.Topic(stack, topicName);

  const lambda = (lambdaName: string, lambdaProps: Lambda.FunctionProps) =>
    new Lambda.Function(stack, lambdaName, lambdaProps);

  const subscription = (topic: SNS.Topic, queue: SQS.Queue) =>
    topic.addSubscription(new Subs.SqsSubscription(queue));

  const deploy = () => {
    // app.synth();
  };

  return { deploy, queue, topic, lambda, subscription };
};
