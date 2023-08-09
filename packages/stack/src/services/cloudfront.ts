import { Stack as CloudFormationStack } from 'aws-cdk-lib';
import * as CloudFront from 'aws-cdk-lib/aws-cloudfront';

export default function useCloudFront(stack: CloudFormationStack) {
  const originAccessIdentity = (id: string) =>
    new CloudFront.OriginAccessIdentity(stack, id);

  const webDistribution = (
    webDistributionProps: CloudFront.CloudFrontWebDistributionProps
  ) =>
    new CloudFront.CloudFrontWebDistribution(
      stack,
      'RebelWebDistribution',
      webDistributionProps
    );

  return { originAccessIdentity, webDistribution };
}
