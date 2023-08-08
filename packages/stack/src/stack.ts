import {
  App as CloudFormationApp,
  Stack as CloudFormationStack,
  StackProps as CloudFormationStackProps,
  Duration,
} from 'aws-cdk-lib';

import { Stack } from './types';
import useAppConfig from './services/appconfig';
import useCloudWatch from './services/cloudwatch';
import useDynamoDB from './services/dynamodb';
import useIAM from './services/iam';
import useLambda from './services/lambda';
import useSQS from './services/sqs';
import useSNS from './services/sns';
import useS3 from './services/s3';
import useApiGateway from './services/apigateway';
import useCloudFront from './services/cloudfront';
import useRoute53 from './services/route53';
import useCognito from './services/cognito';
import useSecretsManager from './services/secretsmanager';
import useEvents from './services/events';
import useCDK from './services/cdk';

export const useStack = (
  stackName: string,
  stackProps?: CloudFormationStackProps
): Stack => {
  const app = new CloudFormationApp();
  const stack = new CloudFormationStack(app, stackName, stackProps);

  const apiGateway = useApiGateway(stack);
  const appConfig = useAppConfig(stack);
  const cdk = useCDK(stack);
  const cloudFront = useCloudFront(stack);
  const cloudWatch = useCloudWatch(stack);
  const cognito = useCognito(stack);
  const dynamoDB = useDynamoDB(stack);
  const events = useEvents(stack);
  const lambda = useLambda(stack);
  const iam = useIAM(stack);
  const s3 = useS3(stack);
  const secretsManager = useSecretsManager(stack);
  const route53 = useRoute53(stack);
  const sqs = useSQS(stack);
  const sns = useSNS(stack);

  const deploy = () => {
    app.synth();
  };

  return {
    apiGateway,
    appConfig,
    cdk,
    cloudFront,
    cloudWatch,
    cognito,
    dynamoDB,
    events,
    lambda,
    iam,
    s3,
    secretsManager,
    route53,
    sqs,
    sns,
    deploy,
  };
};
