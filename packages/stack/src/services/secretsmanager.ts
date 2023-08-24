import {
  Stack as CloudFormationStack,
  SecretValue,
  SecretsManagerSecretOptions,
} from 'aws-cdk-lib';
import * as SecretsManager from 'aws-cdk-lib/aws-secretsmanager';

export default function useSecretsManager(stack: CloudFormationStack) {
  const secret = (
    name: string,
    value: string,
    props?: SecretsManager.SecretProps
  ) =>
    new SecretsManager.Secret(stack, name, {
      secretName: name,
      secretStringValue: new SecretValue(value),
      ...props,
    });

  const value = (name: string, options?: SecretsManagerSecretOptions) =>
    SecretValue.secretsManager(name, options);

  return { secret, value };
}
