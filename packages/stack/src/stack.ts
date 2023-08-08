import {
  App as CloudFormationApp,
  Stack as CloudFormationStack,
  StackProps as CloudFormationStackProps,
  Duration,
} from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as AppConfig from 'aws-cdk-lib/aws-appconfig';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import * as ApiGateway from 'aws-cdk-lib/aws-apigateway';
import * as DynamoDB from 'aws-cdk-lib/aws-dynamodb';
import * as S3 from 'aws-cdk-lib/aws-s3';
import * as S3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as CloudFront from 'aws-cdk-lib/aws-cloudfront';
import * as CloudWatch from 'aws-cdk-lib/aws-cloudwatch';
import * as Cognito from 'aws-cdk-lib/aws-cognito';
import * as SNS from 'aws-cdk-lib/aws-sns';
import * as Subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as SQS from 'aws-cdk-lib/aws-sqs';
import * as IAM from 'aws-cdk-lib/aws-iam';
import * as Logs from 'aws-cdk-lib/aws-logs';
import * as Route53 from 'aws-cdk-lib/aws-route53';
import * as SecretsManager from 'aws-cdk-lib/aws-secretsmanager';
import * as Events from 'aws-cdk-lib/aws-events';
import * as Targets from 'aws-cdk-lib/aws-events-targets';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

import { Construct } from 'constructs';
import { Stack } from './types';

export const useStack = (
  stackName: string,
  stackProps?: CloudFormationStackProps
): Stack => {
  const app = new CloudFormationApp();
  const stack = new CloudFormationStack(app, stackName, stackProps);

  const appConfigApplication = (
    appName: string,
    appProps?: AppConfig.CfnApplicationProps
  ) => new AppConfig.CfnApplication(stack, appName, appProps);

  const appConfigEnvironment = (
    envName: string,
    envProps?: AppConfig.CfnEnvironmentProps
  ) => new AppConfig.CfnEnvironment(stack, envName, envProps);

  const appConfigConfigurationProfile = (
    profileName: string,
    profileProps?: AppConfig.CfnConfigurationProfileProps
  ) => new AppConfig.CfnConfigurationProfile(stack, profileName, profileProps);

  const appConfigDeploymentStrategy = (
    strategyName: string,
    strategyProps?: AppConfig.CfnDeploymentStrategyProps
  ) => new AppConfig.CfnDeploymentStrategy(stack, strategyName, strategyProps);

  const appConfigDeployment = (
    deploymentName: string,
    deploymentProps?: AppConfig.CfnDeploymentProps
  ) => new AppConfig.CfnDeployment(stack, deploymentName, deploymentProps);

  const queue = (queueName: string, queueProps: SQS.QueueProps) =>
    new SQS.Queue(stack, queueName, queueProps);

  const topic = (topicName: string) => new SNS.Topic(stack, topicName);

  const lambda = (name: string, props: Lambda.FunctionProps) =>
    new NodejsFunction(stack, name, props);

  const subscription = (topic: SNS.Topic, queue: SQS.Queue) =>
    topic.addSubscription(new Subs.SqsSubscription(queue));

  const role = (roleName: string, roleProps: IAM.RoleProps) =>
    new IAM.Role(stack, roleName, roleProps);

  const attachPolicy = (role: IAM.IRole, policyArn: string) =>
    role.addManagedPolicy(
      IAM.ManagedPolicy.fromAwsManagedPolicyName(policyArn)
    );

  const logGroup = (logGroupName: string, logGroupProps: Logs.LogGroupProps) =>
    new Logs.LogGroup(stack, logGroupName, logGroupProps);

  const alarm = (
    alarmName: string,
    metric: CloudWatch.Metric,
    alarmProps: CloudWatch.AlarmProps
  ) => new CloudWatch.Alarm(stack, alarmName, { metric, ...alarmProps });

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

  const originAccessIdentity = (id: string) =>
    new CloudFront.OriginAccessIdentity(stack, id);

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

  const userPool = (
    userPoolName: string,
    userPoolProps: Cognito.UserPoolProps = {}
  ) => new Cognito.UserPool(stack, userPoolName, userPoolProps);

  const userPoolClient = (
    clientName: string,
    userPool: Cognito.UserPool,
    clientProps: Cognito.UserPoolClientProps
  ) =>
    new Cognito.UserPoolClient(stack, clientName, {
      userPool,
      ...clientProps,
    });

  const identityPool = (
    identityPoolName: string,
    identityPoolProps: Cognito.CfnIdentityPoolProps
  ) => new Cognito.CfnIdentityPool(stack, identityPoolName, identityPoolProps);

  const secret = (
    secretName: string,
    secretProps?: SecretsManager.SecretProps
  ) => new SecretsManager.Secret(stack, secretName, secretProps);

  const secretValue = (
    secret: SecretsManager.ISecret,
    versionStage: string = 'AWSCURRENT'
  ) => secret.secretValueFromJson(versionStage);

  const eventBus = (
    eventBusName: string,
    eventBusProps?: Events.EventBusProps
  ) => new Events.EventBus(stack, eventBusName, eventBusProps);

  const rule = (ruleName: string, ruleProps: Events.RuleProps) =>
    new Events.Rule(stack, ruleName, ruleProps);

  const targetLambda = (lambdaFunction: Lambda.Function) =>
    new Targets.LambdaFunction(lambdaFunction);

  const output = (outputName: string, outputProps: cdk.CfnOutputProps) =>
    new cdk.CfnOutput(stack, outputName, outputProps);

  const deploy = () => {
    app.synth();
  };

  return {
    appConfigApplication,
    appConfigEnvironment,
    appConfigConfigurationProfile,
    appConfigDeploymentStrategy,
    appConfigDeployment,
    alarm,
    deploy,
    queue,
    topic,
    lambda,
    subscription,
    role,
    attachPolicy,
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
    userPool,
    userPoolClient,
    identityPool,
    secret,
    secretValue,
    eventBus,
    rule,
    targetLambda,
    output,
  };
};
