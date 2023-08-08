import * as AppConfig from 'aws-cdk-lib/aws-appconfig';
import { Stack as CloudFormationStack } from 'aws-cdk-lib';

export default function useAppConfig(stack: CloudFormationStack) {
  const appConfigApplication = (
    appName: string,
    appProps?: AppConfig.CfnApplicationProps
  ) => new AppConfig.CfnApplication(stack, appName, appProps);

  const appConfigEnvironment = (
    envName: string,
    envProps?: AppConfig.CfnEnvironmentProps
  ) => new AppConfig.CfnEnvironment(stack, envName, envProps);

  const appConfigConfigurationProfile = (
    profileName: string,
    profileProps?: AppConfig.CfnConfigurationProfileProps
  ) => new AppConfig.CfnConfigurationProfile(stack, profileName, profileProps);

  const appConfigDeploymentStrategy = (
    strategyName: string,
    strategyProps?: AppConfig.CfnDeploymentStrategyProps
  ) => new AppConfig.CfnDeploymentStrategy(stack, strategyName, strategyProps);

  const appConfigDeployment = (
    deploymentName: string,
    deploymentProps?: AppConfig.CfnDeploymentProps
  ) => new AppConfig.CfnDeployment(stack, deploymentName, deploymentProps);

  return {
    appConfigApplication,
    appConfigEnvironment,
    appConfigConfigurationProfile,
    appConfigDeploymentStrategy,
    appConfigDeployment,
  };
}
