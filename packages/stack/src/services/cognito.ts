import { Stack as CloudFormationStack } from 'aws-cdk-lib';
import * as Cognito from 'aws-cdk-lib/aws-cognito';

export default function useCognito(stack: CloudFormationStack) {
  const userPool = (
    userPoolName: string,
    userPoolProps: Cognito.UserPoolProps = {}
  ) => new Cognito.UserPool(stack, userPoolName, userPoolProps);

  const userPoolClient = (
    clientName: string,
    userPool: Cognito.UserPool,
    clientProps: Cognito.UserPoolClientProps
  ) =>
    new Cognito.UserPoolClient(stack, clientName, {
      userPool,
      ...clientProps,
    });

  const identityPool = (
    identityPoolName: string,
    identityPoolProps: Cognito.CfnIdentityPoolProps
  ) => new Cognito.CfnIdentityPool(stack, identityPoolName, identityPoolProps);

  return { userPool, userPoolClient, identityPool };
}
