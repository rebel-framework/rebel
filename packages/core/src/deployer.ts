import { App, Stack, StackProps, Duration } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export const useDeployer = (stackName: string, stackProps?: StackProps) => {
  const app = new App();
  const stack = new Stack(app, stackName, stackProps);

  const createQueue = (queueName: string, queueProps: sqs.QueueProps) => {
    const queue = new sqs.Queue(stack, queueName, queueProps);
    return queue;
  };

  const createTopic = (topicName: string) => {
    const topic = new sns.Topic(stack, topicName);
    return topic;
  };

  const createSubscription = (topic: sns.Topic, queue: sqs.Queue) => {
    topic.addSubscription(new subs.SqsSubscription(queue));
  };

  const deploy = () => {
    const queue = createQueue('CdkTemplateQueue', {
      visibilityTimeout: Duration.seconds(300),
    });

    const topic = createTopic('CdkTemplateTopic');

    createSubscription(topic, queue);
  };

  return { deploy };
};

/**

export const useDeployer = (
  stackName: string,
  app?: App,
  stackProps?: StackProps
) => {
  const stack = new Stack(app, stackName, stackProps);

  const deployLambda = (
    lambdaName: string,
    lambdaProps: lambda.FunctionProps
  ) => {
    const fn = new lambda.Function(stack, lambdaName, lambdaProps);
    return fn;
  };

  const deployApiGateway = (
    gatewayName: string,
    gatewayProps: apigateway.LambdaRestApiProps
  ) => {
    const gateway = new apigateway.LambdaRestApi(
      stack,
      gatewayName,
      gatewayProps
    );
    return gateway;
  };

  const deployDatabase = (
    tableName: string,
    tableProps: dynamodb.TableProps
  ) => {
    const table = new dynamodb.Table(stack, tableName, tableProps);
    return table;
  };

  const deployFrontend = (
    bucketName: string,
    deployProps: s3deploy.BucketDeploymentProps
  ) => {
    const bucket = new s3.Bucket(stack, bucketName);
    new s3deploy.BucketDeployment(stack, `${bucketName}Deployment`, {
      destinationBucket: bucket,
      ...deployProps,
    });

    new cloudfront.CloudFrontWebDistribution(
      stack,
      `${bucketName}Distribution`,
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );
  };

  const deploy = () => {
    // Deploy API Gateway and Lambda for each defined route
    // router.routes.forEach((route) => {
    //   const lambdaName = `${route.method}-${route.path}`;
    //   const fn = deployLambda(lambdaName, {
    //     runtime: lambda.Runtime.NODEJS_14_X,
    //     handler: 'index.handler',
    //     code: lambda.Code.fromAsset('./src'), // Path to lambda source code
    //   });

    //   deployApiGateway('MyGateway', {
    //     handler: fn,
    //     defaultCorsPreflightOptions: {
    //       allowOrigins: apigateway.Cors.ALL_ORIGINS,
    //     },
    //   });
    // });

    // Deploy DynamoDB table
    deployDatabase('MyTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      readCapacity: 5,
      writeCapacity: 5,
      //   removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Deploy frontend
    // deployFrontend('MyFrontend', {
    //   sources: [s3deploy.Source.asset('./public')],
    // });
  };

  return {
    deploy,
    deployLambda,
    deployApiGateway,
    deployDatabase,
    deployFrontend,
  };
};
*/
