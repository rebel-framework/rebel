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

export interface Stack {
  apiGateway: ReturnType<typeof useApiGateway>;
  appConfig: ReturnType<typeof useAppConfig>;
  cdk: ReturnType<typeof useCDK>;
  cloudFront: ReturnType<typeof useCloudFront>;
  cloudWatch: ReturnType<typeof useCloudWatch>;
  cognito: ReturnType<typeof useCognito>;
  dynamoDB: ReturnType<typeof useDynamoDB>;
  events: ReturnType<typeof useEvents>;
  lambda: ReturnType<typeof useLambda>;
  iam: ReturnType<typeof useIAM>;
  s3: ReturnType<typeof useS3>;
  secretsManager: ReturnType<typeof useSecretsManager>;
  route53: ReturnType<typeof useRoute53>;
  sqs: ReturnType<typeof useSQS>;
  sns: ReturnType<typeof useSNS>;
  deploy: () => void;
}
