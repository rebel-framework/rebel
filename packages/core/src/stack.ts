import { App, Stack, StackProps, Duration } from 'aws-cdk-lib';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import * as ApiGateway from 'aws-cdk-lib/aws-apigateway';
import * as DynamoDB from 'aws-cdk-lib/aws-dynamodb';
import * as S3 from 'aws-cdk-lib/aws-s3';
import * as S3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as CloudFront from 'aws-cdk-lib/aws-cloudfront';
import * as SNS from 'aws-cdk-lib/aws-sns';
import * as Subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as SQS from 'aws-cdk-lib/aws-sqs';
import * as IAM from 'aws-cdk-lib/aws-iam';
import * as Logs from 'aws-cdk-lib/aws-logs';
import * as Route53 from 'aws-cdk-lib/aws-route53';

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

  const role = (roleName: string, roleProps: IAM.RoleProps) =>
    new IAM.Role(stack, roleName, roleProps);

  const logGroup = (logGroupName: string, logGroupProps: Logs.LogGroupProps) =>
    new Logs.LogGroup(stack, logGroupName, logGroupProps);

  const table = (tableName: string, tableProps: DynamoDB.TableProps) =>
    new DynamoDB.Table(stack, tableName, tableProps);

  const bucket = (bucketName: string, bucketProps: S3.BucketProps) =>
    new S3.Bucket(stack, bucketName, bucketProps);

  const bucketDeployment = (
    deploymentId: string,
    source: S3Deployment.ISource,
    bucket: S3.IBucket,
    deploymentProps?: S3Deployment.BucketDeploymentProps
  ) =>
    new S3Deployment.BucketDeployment(stack, deploymentId, {
      sources: [source],
      destinationBucket: bucket,
      ...deploymentProps,
    });

  const apiGateway = (apiName: string, apiProps: ApiGateway.RestApiProps) =>
    new ApiGateway.RestApi(stack, apiName, apiProps);

  const resource = (
    api: ApiGateway.RestApi,
    pathPart: string,
    parent?: ApiGateway.IResource
  ) => (parent ? parent.addResource(pathPart) : api.root.addResource(pathPart));

  const method = (
    resource: ApiGateway.IResource,
    httpMethod: string,
    integration: ApiGateway.Integration,
    methodOptions?: ApiGateway.MethodOptions
  ) => resource.addMethod(httpMethod, integration, methodOptions);

  const originAccessIdentity = () =>
    new CloudFront.OriginAccessIdentity(stack, 'MyOriginAccessIdentity');

  const cloudFrontWebDistribution = (
    webDistributionProps: CloudFront.CloudFrontWebDistributionProps
  ) =>
    new CloudFront.CloudFrontWebDistribution(
      stack,
      'MyCDN',
      webDistributionProps
    );

  const hostedZone = (
    zoneName: string,
    hostedZoneProps?: Route53.HostedZoneProps
  ) => new Route53.HostedZone(stack, zoneName, hostedZoneProps);

  const deploy = () => {
    // app.synth();
  };

  return {
    deploy,
    queue,
    topic,
    lambda,
    subscription,
    role,
    logGroup,
    table,
    bucket,
    bucketDeployment,
    apiGateway,
    resource,
    method,
    originAccessIdentity,
    cloudFrontWebDistribution,
    hostedZone,
  };
};
