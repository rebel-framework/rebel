import { Stack as CloudFormationStack } from 'aws-cdk-lib';
import * as SecretsManager from 'aws-cdk-lib/aws-secretsmanager';

export default function useSecretsManager(stack: CloudFormationStack) {
  const secret = (
    secretName: string,
    secretProps?: SecretsManager.SecretProps
  ) => new SecretsManager.Secret(stack, secretName, secretProps);

  const secretValue = (
    secret: SecretsManager.ISecret,
    versionStage: string = 'AWSCURRENT'
  ) => secret.secretValueFromJson(versionStage);

  return { secret, secretValue };
}
