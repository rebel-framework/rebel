import { root } from '@rebel-framework/core';
import * as S3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity,
} from 'aws-cdk-lib/aws-cloudfront';
import { Stack } from '../types';

export type Frontend = {
  siteBucket: Bucket;
  originAccessIdentity: OriginAccessIdentity;
  bucketPolicy: PolicyStatement;
  distribution: CloudFrontWebDistribution;
};

export function useFrontend(stack: Stack): Frontend {
  // Define the S3 bucket
  const siteBucket = stack.s3.bucket('RebelStaticWebsiteBucket', {
    websiteIndexDocument: 'index.html',
    publicReadAccess: false, // Since publicReadAccess is false, we need to define our own bucket policy
    removalPolicy: RemovalPolicy.DESTROY,
  });

  // Define the Origin Access Identity
  const originAccessIdentity = stack.cloudFront.originAccessIdentity(
    'RebelOriginAccessIdentity'
  );

  // Define a bucket policy to allow CloudFront to access the bucket
  const bucketPolicy = new PolicyStatement({
    actions: ['s3:GetObject'],
    effect: Effect.ALLOW,
    principals: [originAccessIdentity.grantPrincipal],
    resources: [siteBucket.bucketArn + '/*'],
  });

  // Attach the bucket policy to the bucket
  siteBucket.addToResourcePolicy(bucketPolicy);

  // Define the S3 bucket deployment
  stack.s3.bucketDeployment(
    'RebelWebsiteDeployment',
    S3Deployment.Source.asset(root('src/frontend')),
    siteBucket
  );

  // Define the CloudFront distribution
  const distribution = stack.cloudFront.webDistribution({
    originConfigs: [
      {
        s3OriginSource: {
          s3BucketSource: siteBucket,
          originAccessIdentity: originAccessIdentity, // Add the OAI here
        },
        behaviors: [{ isDefaultBehavior: true }],
      },
    ],
    defaultRootObject: 'index.html',
  });

  // Print out the domain name of the CloudFront distribution
  stack.cdk.output('DistributionDomainName', {
    value: distribution.distributionDomainName,
  });

  return {
    siteBucket,
    originAccessIdentity,
    bucketPolicy,
    distribution,
  };
}
