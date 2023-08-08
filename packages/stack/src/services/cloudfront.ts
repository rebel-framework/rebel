import { Stack as CloudFormationStack } from 'aws-cdk-lib';
import * as CloudFront from 'aws-cdk-lib/aws-cloudfront';

export default function useCloudFront(stack: CloudFormationStack) {
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

  return { originAccessIdentity, cloudFrontWebDistribution };
}
