import { Stack as CloudFormationStack } from 'aws-cdk-lib';
import * as CloudWatch from 'aws-cdk-lib/aws-cloudwatch';

export default function useCloudWatch(stack: CloudFormationStack) {
  const alarm = (
    alarmName: string,
    metric: CloudWatch.Metric,
    alarmProps: CloudWatch.AlarmProps
  ) => new CloudWatch.Alarm(stack, alarmName, { metric, ...alarmProps });

  return { alarm };
}
