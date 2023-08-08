import { Stack as CloudFormationStack } from 'aws-cdk-lib';
import * as IAM from 'aws-cdk-lib/aws-iam';

export default function useIAM(stack: CloudFormationStack) {
  const role = (roleName: string, roleProps: IAM.RoleProps) =>
    new IAM.Role(stack, roleName, roleProps);

  const attachPolicy = (role: IAM.IRole, policyArn: string) =>
    role.addManagedPolicy(
      IAM.ManagedPolicy.fromAwsManagedPolicyName(policyArn)
    );

  return { role, attachPolicy };
}
