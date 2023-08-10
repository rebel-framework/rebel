import useApiGateway from './services/apigateway';
import useAppConfig from './services/appconfig';
import useCDK from './services/cdk';
import useCloudFront from './services/cloudfront';
import useCloudWatch from './services/cloudwatch';
import useCodeBuild from './services/codebuild';
import useCodePipeline from './services/codepipeline';
import useCognito from './services/cognito';
import useDynamoDB from './services/dynamodb';
import useEvents from './services/events';
import useIAM from './services/iam';
import useLambda from './services/lambda';
import useRoute53 from './services/route53';
import useS3 from './services/s3';
import useSNS from './services/sns';
import useSQS from './services/sqs';
import useSecretsManager from './services/secretsmanager';

export interface Stack {
  apiGateway: ReturnType<typeof useApiGateway>;
  appConfig: ReturnType<typeof useAppConfig>;
  cdk: ReturnType<typeof useCDK>;
  cloudFront: ReturnType<typeof useCloudFront>;
  cloudWatch: ReturnType<typeof useCloudWatch>;
  codeBuild: ReturnType<typeof useCodeBuild>;
  codePipeline: ReturnType<typeof useCodePipeline>;
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
