import { Stack as CloudFormationStack } from 'aws-cdk-lib';
import * as S3 from 'aws-cdk-lib/aws-s3';
import * as S3Deployment from 'aws-cdk-lib/aws-s3-deployment';

export default function useS3(stack: CloudFormationStack) {
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

  return { bucket, bucketDeployment };
}
