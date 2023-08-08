import { Stack as CloudFormationStack } from 'aws-cdk-lib';
import * as Route53 from 'aws-cdk-lib/aws-route53';

export default function useRoute53(stack: CloudFormationStack) {
  const hostedZone = (
    zoneName: string,
    hostedZoneProps?: Route53.HostedZoneProps
  ) => new Route53.HostedZone(stack, zoneName, hostedZoneProps);

  return { hostedZone };
}
